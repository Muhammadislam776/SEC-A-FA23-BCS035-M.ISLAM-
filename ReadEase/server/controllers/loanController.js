const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');

exports.createLoan = async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user.id;

    try {
        const book = await Book.findById(bookId);
        if (!book || book.availableCopies <= 0) {
            return res.status(400).json({ message: 'Book not available for borrowing' });
        }

        // Check if user already has an active loan for this book
        const existingLoan = await Loan.findOne({ book: bookId, user: userId, status: 'ACTIVE' });
        if (existingLoan) return res.status(400).json({ message: 'You already have an active loan for this book' });

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // 2 weeks default

        const loan = await Loan.create({
            book: bookId,
            user: userId,
            dueDate
        });

        book.borrowedCopies += 1;
        await book.save();

        res.status(201).json(loan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.returnBook = async (req, res) => {
    const { loanId } = req.params;
    try {
        const loan = await Loan.findById(loanId).populate('book');
        if (!loan || loan.status !== 'ACTIVE') return res.status(400).json({ message: 'Invalid loan or already returned' });

        loan.returnDate = new Date();
        loan.status = 'RETURNED';

        // Calculate fine if overdue
        if (loan.returnDate > loan.dueDate) {
            const diffDays = Math.ceil((loan.returnDate - loan.dueDate) / (1000 * 60 * 60 * 24));
            loan.fineAmount = diffDays * 10; // 10 currency units per day
        }

        await loan.save();

        const book = loan.book;
        book.borrowedCopies -= 1;
        await book.save();

        // Check for reservations
        const nextReservation = await Reservation.findOne({ book: book._id, status: 'PENDING' }).sort('reservationDate');
        if (nextReservation) {
            // Notify user or fulfill (logic for notification would go here)
        }

        res.json({ message: 'Book returned', loan });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ user: req.user.id }).populate('book');
        res.json(loans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
