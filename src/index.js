const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const Post = require('./models/posts')
require('dotenv').config();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Conectar-se ao MongoDB antes de iniciar o servidor
connectDB().then(() => {
  // Rota para retornar os dados da coleção 'posts'
  app.get('/', async (req, res) => {
    try {
      const posts = await Post.find({});
      return res.json({ posts });
    } catch (error) {
      console.error('Error retrieving posts:', error.message);
      return res.status(500).json({ error: 'Error retrieving posts' });
    }
  });

  // Iniciar o servidor após a conexão ao MongoDB
  app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`);
  });
});
