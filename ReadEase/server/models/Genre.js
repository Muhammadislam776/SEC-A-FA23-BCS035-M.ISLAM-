const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parentGenre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', default: null },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Genre', genreSchema);
