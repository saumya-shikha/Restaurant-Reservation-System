const express = require('express');
const { body } = require('express-validator');
const tableController = require('../Controllers/tableController');
const protect = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', tableController.getAllTables);

router.post('/', [
  requireRole('admin'),
  body('tableNumber').isNumeric().withMessage('Table number must be numerical'),
  body('capacity').isNumeric().withMessage('Capacity calculation must be provided'),
  validate
], tableController.createTable);

router.patch('/:id', [
  requireRole('admin'),
  validate
], tableController.updateTable);

router.delete('/:id', requireRole('admin'), tableController.deleteTable);

module.exports = router;