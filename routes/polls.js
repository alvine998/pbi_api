const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const PollController = require("../controllers/PollController");

router.post("/", auth, PollController.createPoll);

module.exports = router;
