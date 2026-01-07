const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const AspirationController = require("../controllers/AspirationController");

router.get("/", auth, AspirationController.listAspirations);
router.patch("/:id/status", auth, AspirationController.updateStatus);

module.exports = router;
