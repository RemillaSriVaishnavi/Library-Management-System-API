const express = require('express');
const router = express.Router();
const pool = require('../models/db');

/**
 * PAY FINE
 * POST /fines/:id/pay
 */
router.post('/:id/pay', async (req, res) => {
  try {
    const [result] = await pool.query(
      `UPDATE fines
       SET paid_at = NOW()
       WHERE id = ? AND paid_at IS NULL`,
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Fine not found or already paid' });
    }

    res.json({ message: 'Fine paid successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
