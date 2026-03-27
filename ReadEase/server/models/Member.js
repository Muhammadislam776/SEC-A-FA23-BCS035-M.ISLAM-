const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    membershipDate: { type: Date, default: Date.now },
    borrowedBooks: [{
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        borrowDate: { type: Date, default: Date.now },
        returnDate: { type: Date }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
