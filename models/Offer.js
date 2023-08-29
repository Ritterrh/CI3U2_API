const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    tag: String,
    title: String,
    date: Date,
    imageUrl: String,
    content: String,
});

module.exports = mongoose.model('News', newsSchema);
