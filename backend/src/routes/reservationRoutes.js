const express = require('express');
const { body } = require('express-validator');
const reservationController = require('../Controllers/reservationController');
const protect = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/available', reservationController.getAvailableTables);
router.get('/mine', requireRole('customer'), reservationController.getMyReservations);
router.post('/', [
  requireRole('customer'),
  body('tableId').notEmpty().withMessage('Table ID is a mandatory constraint'),
  body('date').notEmpty().withMessage('Date must be explicitly assigned'),
  body('timeSlot').notEmpty().withMessage('Time slot identifier mandatory'),
  body('guests').isNumeric().withMessage('Numerical count required'),
  validate
], reservationController.createReservation);

router.delete('/:id', reservationController.cancelOrDeleteReservation);

// Admin exclusive scopes
router.get('/', requireRole('admin'), reservationController.getAllReservationsAdmin);
router.patch('/:id', requireRole('admin'), reservationController.updateReservationAdmin);

module.exports = router;