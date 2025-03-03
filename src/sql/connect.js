
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.DB_URI, {
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
    //console.log("Você se conectou com sucesso ao MongoDB!");
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);

  }
}


async function buscarTodosOsPosts() {
  try {
    const db = client.db('posts');
    const collection = db.collection('pubs');
    const versionCollection = db.collection('version');

    const posts = await collection.find({}).toArray();
    const version = await versionCollection.findOne();



    return { posts, version };
  
  } catch (error) {
    console.error('Erro ao recuperar os posts:', error.message);
    throw new Error('Erro ao recuperar os posts');
  } 
  }





module.exports = {
    run,
    buscarTodosOsPosts
  };