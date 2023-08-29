const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const angebotSchema = new Schema({
    tag: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fromDate: {
        type: Date,
        required: true,
    },
    fromTime: {
        type: String,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    toTime: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    infoText: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: '',
    },
});

const Angebot = mongoose.model('Angebot', angebotSchema);

module.exports = Angebot;
