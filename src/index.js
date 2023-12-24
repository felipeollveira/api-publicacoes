const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config()

app.use(cors())
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Definindo o esquema
const postSchema = new mongoose.Schema({
  titulo: String,
  introducao: String,
  desenvolvimento: String,
  conclusao: String,
  data: {
    type: Date,
    default: Date.now,
  },
  autor: String,
  images: String,
});

// Criando o modelo usando o esquema
const Post = mongoose.model('Post', postSchema);

// Rota para retornar os dados da coleção 'posts'
app.get('/', async (req, res) => {
  try {
    // Encontrar todos os documentos na coleção 'posts'
    const posts = await Post.find({});
    return res.json({ posts });
  } catch (error) {
    console.error('Error retrieving posts:', error.message);
    return res.status(500).json({ error: 'Error retrieving posts' });
  }
});

// Rota padrão
app.all('*', (req, res) => {
  res.json({ "everything": "is awesome" });
});

// Conectar-se ao banco de dados antes de escutar
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`);
  });
});
