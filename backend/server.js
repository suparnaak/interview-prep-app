require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const STATUS_CODES = require('./constants/statusCodes');
const MESSAGES = require('./constants/messages');

// Routes
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// MongoDB Connection
connectDB();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    message: MESSAGES.SERVER.TOO_MANY_REQUESTS
  }
});
app.use('/api', apiLimiter);

//Login limiter
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 50, 
  message: {
    success: false,
    message: MESSAGES.AUTH.TOO_MANY_LOGIN_ATTEMPTS
  }
});
app.use('/api/auth/login', loginLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use("/api/chat", chatRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(STATUS_CODES.OK).json({
    success: true,
    message: MESSAGES.SERVER.RUNNING,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
     error: MESSAGES.ROUTE.NOT_FOUND,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: MESSAGES.SERVER.ERROR,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});