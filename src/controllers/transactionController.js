const db = require('../models/db');


// ===============================
// BORROW BOOK
// ===============================
exports.borrowBook = (req, res) => {
  const { member_id, book_id } = req.body;

  // 1. Check member
  const memberQuery = 'SELECT * FROM members WHERE id = ?';
  db.query(memberQuery, [member_id], (err, members) => {
    if (err) return res.status(500).json(err);
    if (members.length === 0)
      return res.status(400).json({ message: 'Member not found' });

    // 2. Check book availability
    const bookQuery =
      'SELECT * FROM books WHERE id = ? AND available_copies > 0';
    db.query(bookQuery, [book_id], (err, books) => {
      if (err) return res.status(500).json(err);
      if (books.length === 0)
        return res.status(400).json({ message: 'Book not available' });

      // 3. Insert transaction (status defaults to 'active')
      const insertTransactionQuery = `
        INSERT INTO transactions (member_id, book_id, due_date)
        VALUES (?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY))
      `;

      db.query(insertTransactionQuery, [member_id, book_id], (err, result) => {
        if (err) return res.status(500).json(err);

        // 4. Update book copies and status
        const updateBookQuery = `
          UPDATE books
          SET available_copies = available_copies - 1,
              status = 'borrowed'
          WHERE id = ?
        `;

        db.query(updateBookQuery, [book_id], (err) => {
          if (err) return res.status(500).json(err);

          res.json({
            message: 'Book borrowed successfully',
            transaction_id: result.insertId
          });
        });
      });
    });
  });
};


// ===============================
// RETURN BOOK
// ===============================
exports.returnBook = (req, res) => {
  const { transaction_id } = req.body;

  // 1. Get active transaction
  const transactionQuery = `
    SELECT * FROM transactions
    WHERE id = ? AND status = 'active'
  `;

  db.query(transactionQuery, [transaction_id], (err, transactions) => {
    if (err) return res.status(500).json(err);
    if (transactions.length === 0)
      return res.status(400).json({ message: 'Invalid transaction' });

    const transaction = transactions[0];
    const dueDate = new Date(transaction.due_date);
    const returnDate = new Date();

    // 2. Calculate fine
    let fine = 0;
    const finePerDay = 10;

    if (returnDate > dueDate) {
      const diffDays = Math.ceil(
        (returnDate - dueDate) / (1000 * 60 * 60 * 24)
      );
      fine = diffDays * finePerDay;
    }

    // 3. Update transaction
    const updateTransactionQuery = `
      UPDATE transactions
      SET returned_at = CURRENT_TIMESTAMP,
          status = 'returned'
      WHERE id = ?
    `;

    db.query(updateTransactionQuery, [transaction_id], (err) => {
      if (err) return res.status(500).json(err);

      // 4. Update book copies
      const updateBookQuery = `
        UPDATE books
        SET available_copies = available_copies + 1,
            status = 'available'
        WHERE id = ?
      `;

      db.query(updateBookQuery, [transaction.book_id], (err) => {
        if (err) return res.status(500).json(err);

        // 5. Insert fine if applicable
        if (fine > 0) {
          const insertFineQuery = `
            INSERT INTO fines (member_id, transaction_id, amount)
            VALUES (?, ?, ?)
          `;
          db.query(
            insertFineQuery,
            [transaction.member_id, transaction_id, fine]
          );
        }

        res.json({
          message: 'Book returned successfully',
          fine: fine
        });
      });
    });
  });
};
