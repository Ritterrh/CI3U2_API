const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    frontIMG: {
        type: String,
        default: '',
    },
    tag: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
