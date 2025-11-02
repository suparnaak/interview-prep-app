const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const STATUS_CODES = require('../constants/statusCodes');
const MESSAGES = require('../constants/messages');
const { sendSuccess, sendError, sanitizeUser } = require('../utils/helpers');
const { validateSignupData, validateLoginData } = require('../utils/validators');


exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const validation = validateSignupData(email, password, name);
    if (!validation.isValid) {
      return sendError(
        res,
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.VALIDATION.FAILED,
        validation.errors
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(
        res,
        STATUS_CODES.CONFLICT,
        MESSAGES.AUTH.USER_EXISTS
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendSuccess(
      res,
      STATUS_CODES.CREATED,
      MESSAGES.AUTH.SIGNUP_SUCCESS,
      {
        token,
        user: sanitizeUser(user),
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return sendError(
      res,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      MESSAGES.SERVER.ERROR
    );
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validateLoginData(email, password);
    if (!validation.isValid) {
      return sendError(
        res,
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.VALIDATION.FAILED,
        validation.errors
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(
        res,
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.AUTH.INVALID_CREDENTIALS
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(
        res,
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.AUTH.INVALID_CREDENTIALS
      );
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendSuccess(
      res,
      STATUS_CODES.OK,
      MESSAGES.AUTH.LOGIN_SUCCESS,
      {
        token,
        user: sanitizeUser(user),
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return sendError(
      res,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      MESSAGES.SERVER.ERROR
    );
  }
};