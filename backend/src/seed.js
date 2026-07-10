require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Table = require('./models/Table');
const Reservation = require('./models/Reservation');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Seed database connection opened.');

    await User.deleteMany({});
    await Table.deleteMany({});
    await Reservation.deleteMany({});
    console.log('Prior tables, allocations and configurations purged.');

    // Inject exact target capacity configurations
    const rawTables = [
      { tableNumber: 1, capacity: 2, isActive: true },
      { tableNumber: 2, capacity: 2, isActive: true },
      { tableNumber: 3, capacity: 4, isActive: true },
      { tableNumber: 4, capacity: 4, isActive: true },
      { tableNumber: 5, capacity: 6, isActive: true },
      { tableNumber: 6, capacity: 6, isActive: true },
      { tableNumber: 7, capacity: 4, isActive: false }
    ];
    await Table.insertMany(rawTables);
    console.log('Tables seeding structure established.');

    // Inject default administrative structural record
    const adminPassphrase = 'AdminSecurePass123!';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassphrase, salt);

    await User.create({
      name: 'System Admin',
      email: 'admin@restaurant.com',
      passwordHash,
      role: 'admin'
    });

    console.log('\n===============================================');
    console.log('SEED EXECUTION SUCCESSFUL');
    console.log('Default Admin Account Created:');
    console.log('Email:    admin@restaurant.com');
    console.log(`Password: ${adminPassphrase}`);
    console.log('===============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Critical failure when loading seed arrays:', error);
    process.exit(1);
  }
};

seedData();