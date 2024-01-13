const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');


const app = express();
require('dotenv').config();

const {run, buscarTodosOsPosts} = require('./sql/connect');



app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const result = await buscarTodosOsPosts()
    return res.json(result);
  } catch (error) {
    console.error('Erro na rota:', error.message);
    return res.status(500).json({ error: 'Erro na rota' });
  }
});


run().then(() => {
  app.listen(4000, () => {
  console.log(`Servidor Express iniciado na porta ${PORT}`); 
    
  });
}).catch(console.dir);
