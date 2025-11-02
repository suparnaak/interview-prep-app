const MESSAGES = {
  //Route Message
  ROUTE: {
    NOT_FOUND: 'Route not found',
  },

  //validation messages
  VALIDATION: {
  FAILED: 'Validation failed',
},
  // Auth Messages
  AUTH: {
    SIGNUP_SUCCESS: 'Account created successfully',
    LOGIN_SUCCESS: 'Login successful',
    USER_EXISTS: 'User already exists with this email',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_MISSING: 'No authentication token, access denied',
    TOKEN_INVALID: 'Token is not valid',
    TOO_MANY_LOGIN_ATTEMPTS: 'Too many login attempts, try again later.'
  },

  // Document Messages
  DOCUMENT: {
    UPLOAD_SUCCESS: 'Document uploaded successfully',
    UPLOAD_FAILED: 'Failed to upload document',
    DELETE_SUCCESS: 'Document deleted successfully',
    DELETE_FAILED: 'Failed to delete document',
    NOT_FOUND: 'Document not found',
    NO_FILE: 'No file uploaded',
    INVALID_TYPE: 'Invalid document type. Must be resume or jd',
    INVALID_FORMAT: 'Invalid file format. Only PDF files are allowed',
    FILE_TOO_LARGE: 'File size must be less than 2MB',
    FETCH_FAILED: 'Failed to fetch documents',
    TEXT_EXTRACTION_FAILED: 'Could not extract text from PDF',
  },

  // Validation Messages
  VALIDATION: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please provide a valid email',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN: 'Password must be at least 6 characters',
    NAME_REQUIRED: 'Name is required',
    NAME_MIN: 'Name must be at least 2 characters',
  },

  // Server Messages
  SERVER: {
    ERROR: 'Internal server error',
    RUNNING: 'Server is running',
    DB_CONNECTED: 'MongoDB Connected',
    DB_ERROR: 'MongoDB Connection Error',
    TOO_MANY_REQUESTS: 'Too many requests from this IP, please try again later.'
  },
};

module.exports = MESSAGES;