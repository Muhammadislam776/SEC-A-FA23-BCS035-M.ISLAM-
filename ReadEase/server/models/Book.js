const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, unique: true, sparse: true },
    genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
    description: { type: String },
    totalCopies: { type: Number, default: 1 },
    availableCopies: { type: Number, default: 1 },
    borrowedCopies: { type: Number, default: 0 },
    coverUrl: { type: String },
    ratings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        date: { type: Date, default: Date.now }
    }],
    averageRating: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to sync availableCopies = totalCopies - borrowedCopies
bookSchema.pre('save', function() {
    if (this.isModified('totalCopies') || this.isModified('borrowedCopies')) {
        this.availableCopies = this.totalCopies - this.borrowedCopies;
    }
    // Auto-generate ISBN if not provided
    if (!this.isbn) {
        this.isbn = 'ISBN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
});

module.exports = mongoose.model('Book', bookSchema);
