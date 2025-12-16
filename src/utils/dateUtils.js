const dayjs = require('dayjs');

function getDueDate() {
  return dayjs().add(14, 'day').toDate();
}

function calculateFine(daysLate) {
  return daysLate * 0.5;
}

module.exports = { getDueDate, calculateFine };
