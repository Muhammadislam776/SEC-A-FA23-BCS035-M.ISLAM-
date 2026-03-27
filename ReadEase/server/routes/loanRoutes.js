const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, loanController.createLoan);
router.post('/:loanId/return', protect, loanController.returnBook);
router.get('/my', protect, loanController.getMyLoans);

module.exports = router;
