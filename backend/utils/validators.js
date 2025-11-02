const MESSAGES = require('../constants/messages');

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Name validation
const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// File validation
const isValidPDF = (file) => {
  return file && file.mimetype === 'application/pdf';
};

const isValidFileSize = (file, maxSizeInMB = 2) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file && file.size <= maxSizeInBytes;
};

// Document type validation
const isValidDocumentType = (type) => {
  return ['resume', 'jd'].includes(type);
};

// Validate signup data
const validateSignupData = (email, password, name) => {
  const errors = [];

  if (!email) {
    errors.push(MESSAGES.VALIDATION.EMAIL_REQUIRED);
  } else if (!isValidEmail(email)) {
    errors.push(MESSAGES.VALIDATION.EMAIL_INVALID);
  }

  if (!password) {
    errors.push(MESSAGES.VALIDATION.PASSWORD_REQUIRED);
  } else if (!isValidPassword(password)) {
    errors.push(MESSAGES.VALIDATION.PASSWORD_MIN);
  }

  if (!name) {
    errors.push(MESSAGES.VALIDATION.NAME_REQUIRED);
  } else if (!isValidName(name)) {
    errors.push(MESSAGES.VALIDATION.NAME_MIN);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate login data
const validateLoginData = (email, password) => {
  const errors = [];

  if (!email) {
    errors.push(MESSAGES.VALIDATION.EMAIL_REQUIRED);
  } else if (!isValidEmail(email)) {
    errors.push(MESSAGES.VALIDATION.EMAIL_INVALID);
  }

  if (!password) {
    errors.push(MESSAGES.VALIDATION.PASSWORD_REQUIRED);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidPDF,
  isValidFileSize,
  isValidDocumentType,
  validateSignupData,
  validateLoginData,
};