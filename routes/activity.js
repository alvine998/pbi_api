const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ActivityController = require("../controllers/ActivityController");

router.get("/", auth, ActivityController.getActivityLog);

module.exports = router;
