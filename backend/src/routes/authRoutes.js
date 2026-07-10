const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email sequence required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
  validate
], authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email identifier layout needed'),
  body('password').notEmpty().withMessage('Password cannot be blank'),
  validate
], authController.login);

router.get('/me', protect, authController.getMe);

module.exports = router;