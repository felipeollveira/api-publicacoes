
const PORT = process.env.PORT || 3000;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express()
require('dotenv').config()

app.use(helmet());
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');


const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Você se conectou com sucesso ao MongoDB!");
  } finally {
    // await client.close();
  }
}

app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    return res.json({ posts });
  } catch (error) {
    console.error('Error retrieving posts:', error.message);
    return res.status(500).json({ error: 'Error retrieving posts' });
  }
});

run().then(() => {
  app.listen(3000, () => {
    console.log('Servidor Express iniciado na porta 3000');
  });
}).catch(console.dir);

