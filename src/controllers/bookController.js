const pool = require('../models/db');

/**
 * CREATE BOOK
 * POST /books
 */
exports.createBook = async (req, res) => {
  const { isbn, title, author, category, total_copies } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO books (isbn, title, author, category, total_copies, available_copies)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [isbn, title, author, category, total_copies, total_copies]
    );

    res.status(201).json({ message: 'Book created', bookId: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET ALL BOOKS
 * GET /books
 */
exports.getAllBooks = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM books');
  res.json(rows);
};

/**
 * GET BOOK BY ID
 * GET /books/:id
 */
exports.getBookById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);

  if (!rows.length) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.json(rows[0]);
};

/**
 * UPDATE BOOK
 * PUT /books/:id
 */
exports.updateBook = async (req, res) => {
  const { title, author, category } = req.body;

  await pool.query(
    'UPDATE books SET title=?, author=?, category=? WHERE id=?',
    [title, author, category, req.params.id]
  );

  res.json({ message: 'Book updated' });
};

/**
 * DELETE BOOK
 * DELETE /books/:id
 */
exports.deleteBook = async (req, res) => {
  await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
  res.json({ message: 'Book deleted' });
};

/**
 * GET AVAILABLE BOOKS
 * GET /books/available
 */
exports.getAvailableBooks = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM books WHERE status='available' AND available_copies > 0"
  );
  res.json(rows);
};
