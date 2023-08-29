const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    frontImage: String,
    frontText: String,
});

module.exports = mongoose.model('Category', categorySchema);
