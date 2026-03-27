const Book = require('../models/Book');
const Member = require('../models/Member');

exports.getStats = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const totalMembers = await Member.countDocuments();
        
        const books = await Book.find();
        const borrowedBooks = books.reduce((acc, book) => acc + (book.totalCopies - book.availableCopies), 0);
        const availableCopies = books.reduce((acc, book) => acc + book.availableCopies, 0);

        // Simple monthly trend data (mocked for now but could be derived from createdAt)
        const trends = [12, 19, 3, 5, 2, 3]; 

        res.json({
            totalBooks,
            totalMembers,
            borrowedBooks,
            availableCopies,
            trends
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
