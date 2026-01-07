const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const UserController = require("../controllers/UserController");

router.get("/", auth, UserController.listUsers);
router.post("/", auth, UserController.createUser);

module.exports = router;
