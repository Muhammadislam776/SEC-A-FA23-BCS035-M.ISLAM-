const Book = require('../models/Book');
const User = require('../models/User');

exports.addReview = async (req, res) => {
    const { rating, review } = req.body;
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Add rating
        const reviewObj = {
            user: req.user.id,
            rating: Number(rating),
            review
        };

        book.ratings.push(reviewObj);
        
        // Update average rating
        book.averageRating = book.ratings.reduce((acc, item) => item.rating + acc, 0) / book.ratings.length;

        await book.save();
        res.status(201).json({ message: 'Review added', book });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.toggleWishlist = async (req, res) => {
    const { bookId } = req.params;
    try {
        const user = await User.findById(req.user.id);
        const index = user.wishlist.indexOf(bookId);
        
        if (index === -1) {
            user.wishlist.push(bookId);
            await user.save();
            res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
        } else {
            user.wishlist.splice(index, 1);
            await user.save();
            res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
