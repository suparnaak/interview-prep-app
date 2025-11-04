const CONSTANTS = {
  DOC: {
    WORDS_PER_CHUNK: 500,
    ARR_SIZES: ["Bytes", "KB", "MB", "GB"],
    TYPES: {
      JD: "jd",
      RESUME: "resume",
    },
  },
  AI: {
    GEMINI_CHAT_MODEL: "gemini-2.0-flash-exp",
    GEMINI_EMBEDDING_MODEL: "text-embedding-004",
    RESUME_CHAR_LIMIT: 2000,
  },

  //for file uploads
  UPLOAD_CONSTANTS: {
    FOLDER: "interview-prep-docs",
    ALLOWED_FORMATS: ["pdf"],
    RESOURCE_TYPE: "raw",
    MAX_FILE_SIZE: 2 * 1024 * 1024,
  },
  ROLE:{
    AI:'ai',
    USER:'user',
  }
};
module.exports = CONSTANTS;
