const { AppError } = require('./errorHandler');

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: Access denied due to role restrictions', 403, 'FORBIDDEN'));
    }
    next();
  };
};

module.exports = { requireRole };