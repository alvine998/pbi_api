const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ChatController = require("../controllers/ChatController");

router.post("/:sessionId/messages", auth, ChatController.sendMessage);

module.exports = router;
