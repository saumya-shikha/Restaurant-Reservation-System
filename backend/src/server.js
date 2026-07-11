require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db'); // Mongoose connection file

// Initialize Express App
const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// =================================================================
// 🚀 TEMPORARY CLOUD SEEDING ROUTE (Is link ko browser mein hit karna hai)
// =================================================================
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Table = require('./src/models/Table');
const Reservation = require('./src/models/Reservation');

app.get('/api/seed-cloud-db', async (req, res) => {
  try {
    console.log('Triggering cloud database seeding...');
    
    // Purana data clear karein
    await User.deleteMany({});
    await Table.deleteMany({});
    await Reservation.deleteMany({});

    // Raw Tables Data Inject karein
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

    // Default Admin Record Create karein
    const adminPassphrase = 'AdminSecurePass123!';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassphrase, salt);

    await User.create({
      name: 'System Admin',
      email: 'admin@restaurant.com',
      passwordHash,
      role: 'admin'
    });

    res.status(200).json({ 
      success: true, 
      message: "Database seeded successfully directly on Cloud MongoDB Atlas!" 
    });
  } catch (error) {
    console.error('Seeding failure:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// =================================================================

// Main API Routes (Apne real routes ke variable names check kar lijiye)
// Agar aapke routes files bani hain toh unhe yahan call karein, jaise:
// app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/tables', require('./src/routes/tableRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('Restaurant Reservation Backend Server is Running Live...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong on the server!' });
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing successfully on port ${PORT}`);
});