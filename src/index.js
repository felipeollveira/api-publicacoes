const express = require('express');
const session = require('express-session')
const server = express();
const cors = require('cors');
const knex = require('./sql/connect')
require('dotenv').config()
const sessionSecret = process.env.private_key


server.use(session({ secret: sessionSecret, resave: true, saveUninitialized: true }));


server.use(cors());



server.get('/', async (req, res) => {
    try {
      const posts = await knex('post').select('*');
      return res.status(200).json({ posts });
    } catch (error) {
      console.error('Erro ao obter posts:', error.message);
      return res.status(500).json({ error: 'Erro ao obter posts' });
    }
  });

// Iniciand o servidor
const PORT = process.env.PORT || 3000; 
server.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

console.log(`http://localhost:${PORT}/`)
