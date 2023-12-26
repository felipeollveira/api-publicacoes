const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
require('dotenv').config();

app.use(helmet());
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Você se conectou com sucesso ao MongoDB!");
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);

  }
}

app.get('/', async (req, res) => {
  try {

    const db = client.db('posts');
    const collection = db.collection('pubs');

    const posts = await collection.find({}).toArray();

    return res.json({ posts });
  } catch (error) {
    console.error('Erro ao recuperar os posts:', error.message);
    return res.status(500).json({ error: 'Erro ao recuperar os posts' });
  }
});

run().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor Express iniciado na porta ${PORT}`);
  });
}).catch(console.dir);
