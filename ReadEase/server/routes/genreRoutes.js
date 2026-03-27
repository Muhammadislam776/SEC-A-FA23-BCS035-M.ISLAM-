const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', genreController.getGenres);
router.get('/hierarchy', genreController.getGenreHierarchy);
router.post('/', protect, admin, genreController.createGenre);

module.exports = router;
