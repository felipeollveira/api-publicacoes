const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');

const { client } = require('./sql/connect');

const app = express();
require('dotenv').config();

const {run} = require('./sql/connect');


app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const db = client.db('posts');
    const collection = db.collection('pubs');
    const versionCollection = db.collection('version');

    const posts = await collection.find({}).toArray();
    const version = await versionCollection.findOne();

    return res.status(200).json({ posts, version });
  
  } catch (error) {
    console.error('Erro ao recuperar os posts:', error.message);
    return res.status(500).send('Erro ao recuperar os posts');
  } finally {
    if (client) {
      await client.close();
    }
  }
}
);

run().then(() => {
  app.listen(4000, () => {
  console.log(`Servidor Express iniciado na porta ${PORT}`); 
    
  });
}).catch(console.dir);
