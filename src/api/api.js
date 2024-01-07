require('dotenv').config();

const fs = require('fs').promises;
const path = require('path');

const { client } = require('../sql/connect');
const { exec } = require('child_process');

async function buscarTodosOsPosts() {
  try {
    await client.connect();
    const db = client.db('posts');
    const collection = db.collection('pubs');
    const versionCollection = db.collection('version');

    const posts = await collection.find({}).toArray();
    const version = await versionCollection.findOne();

    return { posts, version }
  } catch (error) {
    console.error('Erro ao recuperar os posts:', error.message);
    throw new Error('Erro ao recuperar os posts');
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function jsonPraApi(data) {
  try {

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    };
    // pensar em alguma alternativa para um json ao blog
    const response = await fetch(null, requestOptions);

    if (!response.ok) {
      throw new Error('Erro ao enviar dados para o servidor.');
    }

    console.log('Dados enviados com sucesso para o servidor local.');
  } catch (error) {
    console.error('Erro ao processar os dados:', error.message);
  }
}


async function criarOuAtualizarArquivoJSON() {
  try {
    const { posts, version } = await buscarTodosOsPosts();
    const jsonData = JSON.stringify({ posts, version }, null, 2);

    const diretorio = path.join(__dirname, '../scratch');
    const caminhoArquivo = path.join(diretorio, 'posts.json');

    // Verifica se o arquivo já existe
    const arquivoExiste = await fs.access(caminhoArquivo).then(() => true).catch(() => false);

    if (arquivoExiste) {
      try {
        const existingVersion = await lerVersaoDoArquivo();

        if (existingVersion === version.v) {
          console.log(`Versão da API OK [v.${existingVersion}]`);
          return;
        } else {
          await fs.writeFile(caminhoArquivo, jsonData, 'utf8');
          jsonPraApi(posts)
          console.log(`Versão da API atualizada para: [v${version.v}]`);
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar a versão do arquivo:', error.message);
        throw error;
      }
    }

    // Se o arquivo não existir, cria o diretório e escreve o arquivo JSON
    await fs.mkdir(diretorio, { recursive: true });
    await fs.writeFile(caminhoArquivo, jsonData, 'utf8');

    console.log(`Arquivo JSON criado na versão [v${version.v}]`);
  } catch (error) {
    console.error('Erro ao criar ou atualizar o arquivo JSON:', error.message);
    throw error;
  }
}

async function lerVersaoDoArquivo() {
  const caminhoArquivo = path.join(__dirname, '../scratch/posts.json');
  try {
    const conteudoArquivo = await fs.readFile(caminhoArquivo, 'utf8');

    if (conteudoArquivo) {
      const dados = JSON.parse(conteudoArquivo);
      const versao = dados.version;

      const actVersion = versao && versao._id && versao.v;
      return actVersion;
    } else {
      console.log('Arquivo JSON não existe ou está vazio.');
      return null; 
    }
  } catch (error) {
    console.error('Erro ao ler a versão do arquivo:', error.message);
    throw error;
  }
}


async function executaOperacoes() {
  await criarOuAtualizarArquivoJSON();
  
}



module.exports = {
  executaOperacoes,
  buscarTodosOsPosts,
};
