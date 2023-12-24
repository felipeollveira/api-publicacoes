const express = require('express');
const session = require('express-session')
const server = express();
const {MongoClient} = require('mongodb');
const cors = require('cors');
let port = 3400;

require('dotenv').config()
const sessionSecret = process.env.private_key
server.use(session({ secret: sessionSecret, resave: true, saveUninitialized: true }));

const uri = process.env.MONGO_URI
const client = new MongoClient( uri );

server.use(cors());

server.get('/', async (req, res) => {
  try {
    const posts = await client.db('publicacoes')
      .collection('posts')
      .find({}) 
      .toArray();

    return res.json({ posts });
  } catch (error) {
    console.error('posts error', error.message);
    return res.status(500).json({ error: 'Erro ao obter posts' });
  }
});



// Iniciand o servidor
const PORT = 3000; 
server.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

console.log(`http://localhost:${PORT}/`)
