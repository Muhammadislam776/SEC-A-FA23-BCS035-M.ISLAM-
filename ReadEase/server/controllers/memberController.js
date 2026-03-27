const Member = require('../models/Member');
const Book = require('../models/Book');

exports.getAllMembers = async (req, res) => {
    try {
        const members = await Member.find().populate('borrowedBooks.bookId');
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id).populate('borrowedBooks.bookId');
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.json(member);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createMember = async (req, res) => {
    const member = new Member(req.body);
    try {
        const newMember = await member.save();
        res.status(201).json(newMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateMember = async (req, res) => {
    try {
        const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMember = async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.borrowBook = async (req, res) => {
    const { memberId, bookId } = req.params;
    try {
        const book = await Book.findById(bookId);
        if (!book || book.availableCopies <= 0) {
            return res.status(400).json({ message: 'Book not available' });
        }

        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        member.borrowedBooks.push({ bookId });
        book.availableCopies -= 1;

        await member.save();
        await book.save();

        res.json({ message: 'Book borrowed successfully', member });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.returnBook = async (req, res) => {
    const { memberId, bookId } = req.params;
    try {
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        const borrowIndex = member.borrowedBooks.findIndex(b => b.bookId.toString() === bookId && !b.returnDate);
        if (borrowIndex === -1) return res.status(400).json({ message: 'Borrow record not found' });

        member.borrowedBooks[borrowIndex].returnDate = new Date();
        const book = await Book.findById(bookId);
        book.availableCopies += 1;

        await member.save();
        await book.save();

        res.json({ message: 'Book returned successfully', member });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
