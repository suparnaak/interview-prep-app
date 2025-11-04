const express = require("express");
const { startChat, sendMessage } = require("../controllers/chatController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/start", auth, startChat);
router.post("/query", auth, sendMessage);

module.exports = router;
