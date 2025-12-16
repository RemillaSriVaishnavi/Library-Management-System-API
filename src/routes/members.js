const express = require('express');
const router = express.Router();

const {
  createMember,
  getAllMembers,
  getMemberById,
  getBorrowedBooks
} = require('../controllers/memberController');

// Create member
router.post('/', createMember);

// Get all members
router.get('/', getAllMembers);

// Get member by ID
router.get('/:id', getMemberById);

// Get books borrowed by a member
router.get('/:id/borrowed', getBorrowedBooks);

module.exports = router;
