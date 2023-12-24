const express = require('express');
const session = require('express-session')
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config()
const sessionSecret = process.env.private_key


server.use(session({ secret: sessionSecret, resave: true, saveUninitialized: true }));

mongoose.connect(process.env.MONGO_URI)
const Post = require('./models/posts')

server.use(cors());

server.get('/', async (req, res) => {
  try {
    // Obter todos os posts usando Mongoose
    const posts = await Post.find({});

    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Erro ao obter posts:', error.message);
    return res.status(500).json({ error: 'Erro ao obter posts' });
  }
});
// Iniciand o servidor
const PORT = 5000; 
server.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

console.log(`http://localhost:${PORT}/`)
