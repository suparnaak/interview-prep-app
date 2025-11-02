const jwt = require('jsonwebtoken');
const STATUS_CODES = require('../constants/statusCodes');
const MESSAGES = require('../constants/messages');
const { sendError } = require('../utils/helpers');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(
        res,
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.AUTH.TOKEN_MISSING
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return sendError(
      res,
      STATUS_CODES.UNAUTHORIZED,
      MESSAGES.AUTH.TOKEN_INVALID
    );
  }
};

module.exports = auth;