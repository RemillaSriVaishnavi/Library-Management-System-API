const pool = require('../models/db');

async function canBorrow(memberId) {
  const [active] = await pool.query(
    "SELECT COUNT(*) count FROM transactions WHERE member_id=? AND status='active'",
    [memberId]
  );

  if (active[0].count >= 3) return false;

  const [fines] = await pool.query(
    "SELECT COUNT(*) count FROM fines WHERE member_id=? AND paid_at IS NULL",
    [memberId]
  );

  return fines[0].count === 0;
}

module.exports = { canBorrow };
