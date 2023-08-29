const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    image: { type: String, required: true },
    caption: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
