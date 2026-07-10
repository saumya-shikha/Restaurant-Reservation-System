const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({
      error: {
        message: errorMsg,
        code: 'VALIDATION_ERROR'
      }
    });
  }
  next();
};

module.exports = validate;