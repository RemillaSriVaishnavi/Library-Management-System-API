const express = require('express');
const router = express.Router();

const {
    borrowBook,
    returnBook
} = require('../controllers/transactionController');

// Borrow book
router.post('/borrow', borrowBook);

// Return book
router.post('/return', returnBook);

module.exports = router;
