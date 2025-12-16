const express = require('express');
const router = express.Router();

const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getAvailableBooks
} = require('../controllers/bookController');

// Create a book
router.post('/', createBook);

// Get all books
router.get('/', getAllBooks);

// Get available books
router.get('/available', getAvailableBooks);

// Get book by ID
router.get('/:id', getBookById);

// Update book
router.put('/:id', updateBook);

// Delete book
router.delete('/:id', deleteBook);

module.exports = router;
