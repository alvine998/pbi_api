const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const SocialMediaController = require("../controllers/SocialMediaController");

/**
 * @swagger
 * /v1/social-media:
 *   get:
 *     summary: List all social media links
 *     tags: [Social Media]
 *     responses:
 *       200:
 *         description: List of social media profiles
 */
router.get("/", SocialMediaController.listSocialMedia);

/**
 * @swagger
 * /v1/social-media:
 *   post:
 *     summary: Create a new social media profile
 *     tags: [Social Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platform
 *               - url
 *             properties:
 *               platform:
 *                 type: string
 *               url:
 *                 type: string
 *               icon:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Social media created
 */
router.post("/", auth, SocialMediaController.createSocialMedia);

/**
 * @swagger
 * /v1/social-media/{id}:
 *   put:
 *     summary: Update social media profile
 *     tags: [Social Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platform:
 *                 type: string
 *               url:
 *                 type: string
 *               icon:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Social media updated
 */
router.put("/:id", auth, SocialMediaController.updateSocialMedia);

/**
 * @swagger
 * /v1/social-media/{id}:
 *   delete:
 *     summary: Delete social media profile
 *     tags: [Social Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Social media deleted
 */
router.delete("/:id", auth, SocialMediaController.deleteSocialMedia);

module.exports = router;
