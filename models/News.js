const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    tag: [String],
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: String,
    createdBy: {
        type: String,
    },
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
