const allowedTransitions = {
  available: ['borrowed'],
  borrowed: ['available'],
};

function isTransitionAllowed(current, next) {
  return allowedTransitions[current]?.includes(next);
}

module.exports = { isTransitionAllowed };
