const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const { AppError } = require('../middleware/errorHandler');

const ALLOWED_SLOTS = ["12:00-13:30", "13:30-15:00", "18:00-19:30", "19:30-21:00", "21:00-22:30"];

const verifyAndCreateReservation = async ({ customerId, tableId, date, timeSlot, guests }) => {
  // 1. Validate date structure and format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new AppError('Invalid date format. Use YYYY-MM-DD.', 400, 'BAD_REQUEST');
  }

  const inputDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (inputDate < today) {
    throw new AppError('Reservation date cannot be in the past.', 400, 'BAD_REQUEST');
  }

  if (!ALLOWED_SLOTS.includes(timeSlot)) {
    throw new AppError('Requested time slot is invalid.', 400, 'BAD_REQUEST');
  }

  // 2. Load and verify table capacity rules
  const table = await Table.findOne({ _id: tableId, isActive: true });
  if (!table) {
    throw new AppError('Selected table is unavailable or does not exist.', 404, 'NOT_FOUND');
  }

  if (guests > table.capacity) {
    throw new AppError(`Table ${table.tableNumber} seats up to ${table.capacity} guests.`, 409, 'CAPACITY_EXCEEDED');
  }

  // 3. Match against existing active allocations
  const absoluteConflict = await Reservation.findOne({
    table: tableId,
    date,
    timeSlot,
    status: 'confirmed'
  });

  if (absoluteConflict) {
    throw new AppError('This table is already booked for that time slot.', 409, 'BOOKING_CONFLICT');
  }

  // 4. Persistence validation sequence executed safely
  const reservation = await Reservation.create({
    customer: customerId,
    table: tableId,
    date,
    timeSlot,
    guests,
    status: 'confirmed'
  });

  return reservation;
};

const getAvailableTablesForDate = async (date, guests) => {
  const partySize = parseInt(guests, 10);
  if (isNaN(partySize) || partySize <= 0) {
    throw new AppError('Valid guest count required.', 400, 'BAD_REQUEST');
  }

  // Discover eligible baseline target allocations
  const structuralTables = await Table.find({ capacity: { $gte: partySize }, isActive: true });
  const activeBookings = await Reservation.find({ date, status: 'confirmed' });

  const responseMap = structuralTables.map(t => {
    const tableBookings = activeBookings.filter(b => b.table.toString() === t._id.toString());
    const takenSlots = tableBookings.map(b => b.timeSlot);
    const freeSlots = ALLOWED_SLOTS.filter(slot => !takenSlots.includes(slot));

    return {
      _id: t._id,
      tableNumber: t.tableNumber,
      capacity: t.capacity,
      availableSlots: freeSlots
    };
  }).filter(t => t.availableSlots.length > 0);

  return responseMap;
};

module.exports = {
  verifyAndCreateReservation,
  getAvailableTablesForDate
};