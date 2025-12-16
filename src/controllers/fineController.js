const pool = require('../models/db');

/**
 * PAY FINE
 * POST /fines/:id/pay
 *
 * Marks a fine as paid by setting paid_at timestamp.
 * Once paid, the member becomes eligible to borrow again
 * (if no other unpaid fines exist).
 */
exports.payFine = async (req, res) => {
  const fineId = req.params.id;

  try {
    // 1. Check if fine exists and is unpaid
    const [[fine]] = await pool.query(
      `SELECT * FROM fines WHERE id = ?`,
      [fineId]
    );

    if (!fine) {
      return res.status(404).json({ error: 'Fine not found' });
    }

    if (fine.paid_at) {
      return res.status(400).json({ error: 'Fine already paid' });
    }

    // 2. Mark fine as paid
    await pool.query(
      `UPDATE fines
       SET paid_at = NOW()
       WHERE id = ?`,
      [fineId]
    );

    res.json({ message: 'Fine paid successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
