const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
require('dotenv').config();

const {run} = require('./sql/connect');

const path = require('path');
const fs = require('fs').promises;
const { criarArquivoJSON } = require('./api/api');

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const filePath = path.join(__dirname, './scratch/posts.json');
    const jsonData = await fs.readFile(filePath, 'utf8');

    if (!jsonData.trim()) {
      console.error('O arquivo JSON está vazio.');
      res.status(500).json({ error: 'Erro ao obter dados da API.' });
      return;
    }

    const posts = JSON.parse(jsonData);

    

    res.json({ posts });
  } catch (error) {
    console.error('Erro ao ler o arquivo JSON:', error);
    res.status(500).json({ error: 'Erro ao obter dados da API.' });
  }
});

run().then(() => {
  app.listen(PORT, () => {
    criarArquivoJSON()
    console.log(`Servidor Express iniciado na porta ${PORT}`); 
    
  });
}).catch(console.dir);
