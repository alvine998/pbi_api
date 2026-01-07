const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const AuthController = require("../controllers/AuthController");

const upload = multer({ dest: "uploads/" });

router.post("/login", AuthController.login);
router.put(
  "/profile",
  auth,
  upload.single("avatar"),
  AuthController.updateProfile
);
router.post("/change-password", auth, AuthController.changePassword);

module.exports = router;
