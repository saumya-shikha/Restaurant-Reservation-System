require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const tableRoutes = require('./routes/tableRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// Connect Database
connectDB();

// CORS Settings - Fixed to allow all origins
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

// Application Routing Setup
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);

// Global Error Handler Pipeline (Catches all next(err) invocations)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server executing operations efficiently on port ${PORT}`);
});