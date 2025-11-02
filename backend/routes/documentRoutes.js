const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../config/multer");

const {
  uploadDocument,
  getDocuments,
  deleteDocument,
} = require("../controllers/documentController");

router.post("/upload", auth, upload, uploadDocument);

router.get("/list", auth, getDocuments);
router.delete("/:id", auth, deleteDocument);

module.exports = router;
