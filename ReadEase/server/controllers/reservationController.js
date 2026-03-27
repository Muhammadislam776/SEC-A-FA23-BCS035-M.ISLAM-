const Reservation = require('../models/Reservation');
const Book = require('../models/Book');

exports.createReservation = async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user.id;

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        
        if (book.availableCopies > 0) {
            return res.status(400).json({ message: 'Book is currently available, please borrow it instead' });
        }

        const existingRes = await Reservation.findOne({ book: bookId, user: userId, status: 'PENDING' });
        if (existingRes) return res.status(400).json({ message: 'You already have a pending reservation for this book' });

        const queueCount = await Reservation.countDocuments({ book: bookId, status: 'PENDING' });

        const reservation = await Reservation.create({
            book: bookId,
            user: userId,
            queuePosition: queueCount + 1
        });

        res.status(201).json(reservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user.id }).populate('book');
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation || reservation.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        reservation.status = 'CANCELLED';
        await reservation.save();

        // Re-calculate queue positions for others
        const remaining = await Reservation.find({ book: reservation.book, status: 'PENDING' }).sort('reservationDate');
        for (let i = 0; i < remaining.length; i++) {
            remaining[i].queuePosition = i + 1;
            await remaining[i].save();
        }

        res.json({ message: 'Reservation cancelled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
