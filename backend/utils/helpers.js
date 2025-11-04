const STATUS_CODES = require('../constants/statusCodes');
const {DOC} = require('../constants/otherConstants')


// Success response 
/* const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}; */
const sendSuccess = (res, statusCode, message = null, data = null, raw = false) => {
  if (raw) {
    return res.status(statusCode).json(data);
  }

  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error response 
const sendError = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message: message,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Sanitize user data for removing the password
const sanitizeUser = (user) => {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
};

// File size formatting
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = DOC.ARR_SIZES
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Chunk text
const chunkText = (text, wordsPerChunk = DOC.WORDS_PER_CHUNK) => {
  const words = text.split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunk = words.slice(i, i + wordsPerChunk).join(' ');
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
};

module.exports = {
  sendSuccess,
  sendError,
  sanitizeUser,
  formatFileSize,
  chunkText,
};