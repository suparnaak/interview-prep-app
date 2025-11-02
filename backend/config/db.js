const mongoose = require('mongoose');
const MESSAGES = require('../constants/messages');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(` ${MESSAGES.SERVER.DB_CONNECTED}: ${conn.connection.host}`);
  } catch (error) {
    console.error(`${MESSAGES.SERVER.DB_ERROR}:`, error.message);
    process.exit(1);
  }
};

module.exports = connectDB;