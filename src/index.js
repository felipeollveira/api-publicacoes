const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
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

const Post = require('./models/posts');

app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    return res.json({ posts });
  } catch (error) {
    console.error('Error retrieving posts:', error.message);
    return res.status(500).json({ error: 'Error retrieving posts' });
  }
});

// Conectar-se ao banco de dados antes de escutar
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`);
  });
});
