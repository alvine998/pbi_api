const express = require("express");
const router = express.Router();
const AccountDeletionController = require("../controllers/AccountDeletionController");

/**
 * @swagger
 * /v1/account-deletion:
 *   get:
 *     summary: Account deletion policy for Google Play
 *     tags: [Account Deletion]
 *     responses:
 *       200:
 *         description: Account deletion instructions and data retention policy
 */
router.get("/", AccountDeletionController.getPolicy);

module.exports = router;
