const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { check, validationResult } = require('express-validator');
require('dotenv').config()
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Routes
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    return res.json({ posts });
  } catch (error) {
    console.error('Error retrieving posts:', error.message);
    return res.status(500).json({ error: 'Error retrieving posts' });
  }
});

// Connect to MongoDB before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`);
  });
});
