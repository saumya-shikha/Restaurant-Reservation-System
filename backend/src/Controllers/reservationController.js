const Reservation = require('../models/Reservation');
const availabilityService = require('../services/availabilityService');
const { AppError } = require('../middleware/errorHandler');

exports.getAvailableTables = async (req, res, next) => {
  try {
    const { date, guests } = req.query;
    if (!date || !guests) {
      return next(new AppError('Query parameters date and guests are required.', 400, 'BAD_REQUEST'));
    }
    const availabilityData = await availabilityService.getAvailableTablesForDate(date, guests);
    res.status(200).json({ data: availabilityData });
  } catch (error) {
    next(error);
  }
};

exports.createReservation = async (req, res, next) => {
  try {
    const { tableId, date, timeSlot, guests } = req.body;
    
    const reservation = await availabilityService.verifyAndCreateReservation({
      customerId: req.user._id,
      tableId,
      date,
      timeSlot,
      guests
    });

    res.status(201).json({ data: reservation });
  } catch (error) {
    next(error);
  }
};

exports.getMyReservations = async (req, res, next) => {
  try {
    const items = await Reservation.find({ customer: req.user._id })
      .populate('table')
      .sort({ date: -1, timeSlot: -1 });
    res.status(200).json({ data: items });
  } catch (error) {
    next(error);
  }
};

exports.cancelOrDeleteReservation = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const reservation = await Reservation.findById(targetId);

    if (!reservation) {
      return next(new AppError('Reservation records cannot be located', 404, 'NOT_FOUND'));
    }

    if (req.user.role !== 'admin' && reservation.customer.toString() !== req.user._id.toString()) {
      return next(new AppError('Access forbidden to alternative record entities', 403, 'FORBIDDEN'));
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({ data: reservation });
  } catch (error) {
    next(error);
  }
};

exports.getAllReservationsAdmin = async (req, res, next) => {
  try {
    const queryFilter = {};
    if (req.query.date) {
      queryFilter.date = req.query.date;
    }

    const records = await Reservation.find(queryFilter)
      .populate('customer', 'name email')
      .populate('table')
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({ data: records });
  } catch (error) {
    next(error);
  }
};

exports.updateReservationAdmin = async (req, res, next) => {
  try {
    const { status } = req.body;
    const record = await Reservation.findById(req.params.id);

    if (!record) {
      return next(new AppError('Reservation matching key elements missing', 404, 'NOT_FOUND'));
    }

    if (status) record.status = status;
    await record.save();

    res.status(200).json({ data: record });
  } catch (error) {
    next(error);
  }
};