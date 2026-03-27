const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.get('/', memberController.getAllMembers);
router.get('/:id', memberController.getMemberById);
router.post('/', memberController.createMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

router.post('/:memberId/borrow/:bookId', memberController.borrowBook);
router.post('/:memberId/return/:bookId', memberController.returnBook);

module.exports = router;
