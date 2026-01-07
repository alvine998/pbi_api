const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const NotificationController = require("../controllers/NotificationController");

router.patch("/:id/read", auth, NotificationController.markRead);

module.exports = router;
