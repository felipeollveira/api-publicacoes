const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        unique: true,
    },
    introducao: {
        type: String,
        required: true,
    },
    desenvolvimento: {
        type: String,
        required: true,
    },
    conclusao: {
        type: String,
        required: true,
    },
    data: {
        type: Date,
        default: Date.now,
    },
    autor: {
        type: String,
        required: true,
    },
    images: {
        type: String, 
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
