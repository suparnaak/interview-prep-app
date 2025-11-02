const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');
const MESSAGES = require('../constants/messages');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'interview-prep-docs',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

// Multer configuration - resume and jd are accepted
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error(MESSAGES.DOCUMENT.INVALID_FORMAT), false);
    }
  },
}).fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jd', maxCount: 1 },
]);

module.exports = upload;
