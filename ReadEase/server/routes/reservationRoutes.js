const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, reservationController.createReservation);
router.get('/my', protect, reservationController.getMyReservations);
router.delete('/:id', protect, reservationController.cancelReservation);

module.exports = router;
