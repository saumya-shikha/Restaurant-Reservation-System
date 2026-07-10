const Table = require('../models/Table');
const { AppError } = require('../middleware/errorHandler');

exports.getAllTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.status(200).json({ data: tables });
  } catch (error) {
    next(error);
  }
};

exports.createTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity } = req.body;
    const existing = await Table.findOne({ tableNumber });
    if (existing) {
      return next(new AppError('Table number already exists', 400, 'DUPLICATE_RESOURCE'));
    }

    const newTable = await Table.create({ tableNumber, capacity });
    res.status(201).json({ data: newTable });
  } catch (error) {
    next(error);
  }
};

exports.updateTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity, isActive } = req.body;
    const table = await Table.findById(req.params.id);
    if (!table) {
      return next(new AppError('Table structure not found', 404, 'NOT_FOUND'));
    }

    if (tableNumber && tableNumber !== table.tableNumber) {
      const duplicate = await Table.findOne({ tableNumber });
      if (duplicate) {
        return next(new AppError('Target table number is already assigned', 400, 'DUPLICATE_RESOURCE'));
      }
      table.tableNumber = tableNumber;
    }

    if (capacity !== undefined) table.capacity = capacity;
    if (isActive !== undefined) table.isActive = isActive;

    await table.save();
    res.status(200).json({ data: table });
  } catch (error) {
    next(error);
  }
};

exports.deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return next(new AppError('Table could not be located to remove', 404, 'NOT_FOUND'));
    }
    res.status(200).json({ data: { id: table._id, removed: true } });
  } catch (error) {
    next(error);
  }
};