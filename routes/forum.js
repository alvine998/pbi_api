const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ForumController = require("../controllers/ForumController");

router.post("/:id/comments", auth, ForumController.addComment);

module.exports = router;
