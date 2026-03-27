const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reservationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['PENDING', 'FULFILLED', 'CANCELLED'], default: 'PENDING' },
    queuePosition: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
