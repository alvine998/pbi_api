const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const MediaController = require("../controllers/MediaController");

/**
 * @swagger
 * /v1/media:
 *   get:
 *     summary: List all media files in library
 *     tags: [Media Library]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [image, video, document, audio, other]
 *     responses:
 *       200:
 *         description: List of media files
 */
router.get("/", auth, MediaController.listMedia);

/**
 * @swagger
 * /v1/media/{id}:
 *   delete:
 *     summary: Delete a media file
 *     tags: [Media Library]
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
 *         description: Media deleted
 */
router.delete("/:id", auth, MediaController.deleteMedia);

module.exports = router;
