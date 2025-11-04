const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');
const MESSAGES = require('../constants/messages');
const CONSTANTS = require('../constants/otherConstants');
// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: CONSTANTS.UPLOAD_CONSTANTS.FOLDER ,
    allowed_formats: CONSTANTS.UPLOAD_CONSTANTS.ALLOWED_FORMATS,
    resource_type: CONSTANTS.UPLOAD_CONSTANTS.RESOURCE_TYPE,
  },
});

// Multer configuration - resume and jd are accepted
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: CONSTANTS.UPLOAD_CONSTANTS.MAX_FILE_SIZE 
  },
  fileFilter: (req, file, cb) => {
    //validate file type
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error(MESSAGES.DOCUMENT.INVALID_FORMAT), false);
    }

    // validate field name / document type
    if (!['resume', 'jd'].includes(file.fieldname)) {
      return cb(new Error(MESSAGES.DOCUMENT.INVALID_TYPE), false);
    }

    cb(null, true);
  },
}).fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jd', maxCount: 1 },
]);

module.exports = upload;
