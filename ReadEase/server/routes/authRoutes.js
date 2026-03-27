const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/register', authController.registerUser);
router.post('/login', authController.authUser);
router.get('/me', protect, authController.getMe);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Redirection with token in URL (simple for lab environment)
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}`);
    }
);

module.exports = router;
