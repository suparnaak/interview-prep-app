const STATUS_CODES = require("../constants/statusCodes");
const MESSAGES = require("../constants/messages");
const { sendError } = require("../utils/helpers");

const multerErrorHandler = (upload) => {
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.DOCUMENT.FILE_TOO_LARGE
          );
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            "Too many files uploaded"
          );
        }
        
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            "Unexpected field in file upload"
          );
        }

        return sendError(
          res,
          STATUS_CODES.BAD_REQUEST,
          err.message || MESSAGES.DOCUMENT.UPLOAD_FAILED
        );
      }
      
      next();
    });
  };
};

module.exports = multerErrorHandler;