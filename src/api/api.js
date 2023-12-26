require('dotenv').config();

const fs = require('fs').promises;
const path = require('path');

const { client } = require('../sql/connect');

async function buscarTodosOsPosts() {
  try {
    await client.connect();
    const db = client.db('posts');
    const collection = db.collection('pubs');
    const versionCollection = db.collection('version');

    const posts = await collection.find({}).toArray();
    const version = await versionCollection.findOne();

    return { posts, version };
  } catch (error) {
    console.error('Erro ao recuperar os posts:', error.message);
    throw new Error('Erro ao recuperar os posts');
  } finally {
    if (client) {
      await client.close();
    }
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

        if (existingVersion === version._id.vr) {
          console.log(`Versão da API OK [v.${existingVersion}]`);
          return;
        } else {
          await fs.writeFile(caminhoArquivo, jsonData, 'utf8');
          console.log(`Versão da API atualizada para: [v.${version._id.vr}]`);
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

    console.log(`Arquivo JSON criado na versão [v${version._id.vr}]`);
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

      const actVersion = versao && versao._id && versao._id.vr;
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

// Chama a função principal
executaOperacoes();

module.exports = {
  criarOuAtualizarArquivoJSON,
};