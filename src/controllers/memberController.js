const pool = require('../models/db');

/**
 * CREATE MEMBER
 * POST /members
 */
exports.createMember = async (req, res) => {
  const { name, email, membership_number } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO members (name, email, membership_number)
       VALUES (?, ?, ?)`,
      [name, email, membership_number]
    );

    res.status(201).json({ message: 'Member created', memberId: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET ALL MEMBERS
 * GET /members
 */
exports.getAllMembers = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM members');
  res.json(rows);
};

/**
 * GET MEMBER BY ID
 * GET /members/:id
 */
exports.getMemberById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM members WHERE id=?', [req.params.id]);

  if (!rows.length) {
    return res.status(404).json({ error: 'Member not found' });
  }

  res.json(rows[0]);
};

/**
 * GET BOOKS BORROWED BY MEMBER
 * GET /members/:id/borrowed
 */
exports.getBorrowedBooks = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*
     FROM transactions t
     JOIN books b ON t.book_id = b.id
     WHERE t.member_id = ? AND t.status = 'active'`,
    [req.params.id]
  );

  res.json(rows);
};
