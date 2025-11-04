const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../config/multer");
const multerErrorHandler = require("../middleware/multerErrorHandler");

const {
  uploadDocument,
  getDocuments,
  deleteDocument,
} = require("../controllers/documentController");

router.post("/upload", auth, multerErrorHandler(upload), uploadDocument);

router.get("/list", auth, getDocuments);
router.delete("/:id", auth, deleteDocument);

module.exports = router;
