const knex = require('../sql/connect')
const autor = 'felipeoliveira'


const post_go_db = async (req, res, next) => {
    const titulo = req.body.titulo; 
    const introducao = req.body.introducao;
    const desenvolvimento = req.body.assunto;
    const conclusao = req.body.conclusao;
    const imagem = req.body.images
    const timestamp = new Date().toISOString();
    try {
        if (!titulo || !desenvolvimento || !conclusao || !introducao)return res.status(401).send({ message: 'Dados inválidos' });
        const newPost = await knex('post').insert({ titulo, introducao, desenvolvimento, conclusao, data: timestamp, autor, images:imagem });
        console.log(JSON.stringify(req.body.images));

        if (!newPost) return res.status(400).send({ message: 'Erro ao criar o post' });
        res.status(204).send({ message: 'Publicado!' });
        next();

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Erro no servidor' });
    }
};

const return_get = async (req, res) => {
    try {
      const posts = await knex('post').select('*');
      return res.status(200).json({ posts });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  




 





module.exports = {
    post_go_db,
    return_get,
    

}