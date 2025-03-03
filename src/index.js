const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const {corsOptions, logAccess} = require('./api/cors-control')
const { run, buscarTodosOsPosts } = require('./sql/connect');


app.use(logAccess)
app.use(express.json());
app.use(cors(corsOptions));



app.get('/', async (req, res) => {
  try {
    const { posts, version } = await buscarTodosOsPosts();
    if (!posts || !version) {
      return res.status(404).json({ error: 'Dados não encontrados' });
    }
    return res.json({ posts, version: version.v });
  } catch (error) {
    console.error('Erro na rota:', error.message);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

run().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor Express iniciado na porta ${PORT}`);
  });
}).catch(console.dir);