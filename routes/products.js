const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const ProductController = require("../controllers/ProductController");

const upload = multer({ dest: "uploads/" });

router.post("/", auth, upload.array("images"), ProductController.createProduct);

module.exports = router;
