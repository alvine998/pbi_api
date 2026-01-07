const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const NewsController = require("../controllers/NewsController");

router.post("/", auth, NewsController.createNews);

module.exports = router;
