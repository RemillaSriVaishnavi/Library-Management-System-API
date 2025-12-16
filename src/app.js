const express = require('express');
const app = express();

app.use(express.json());

app.use('/books', require('./routes/books'));
app.use('/members', require('./routes/members'));
app.use('/transactions', require('./routes/transactions'));
app.use('/fines', require('./routes/fines'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
