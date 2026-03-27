const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ['ACTIVE', 'RETURNED', 'RENEWED', 'OVERDUE'], default: 'ACTIVE' },
    fineAmount: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
