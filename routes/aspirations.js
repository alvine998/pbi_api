const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const AspirationController = require("../controllers/AspirationController");

/**
 * @swagger
 * /v1/aspirations:
 *   get:
 *     summary: List all aspirations
 *     tags: [Aspirations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of aspirations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Aspiration'
 */
router.get("/", auth, AspirationController.listAspirations);

/**
 * @swagger
 * /v1/aspirations/{id}:
 *   get:
 *     summary: Get aspiration by ID
 *     tags: [Aspirations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Aspiration ID
 *     responses:
 *       200:
 *         description: Aspiration details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aspiration'
 *       404:
 *         description: Aspiration not found
 */
router.get("/:id", auth, AspirationController.getAspirationById);

/**
 * @swagger
 * /v1/aspirations:
 *   post:
 *     summary: Create a new aspiration
 *     tags: [Aspirations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - content
 *             properties:
 *               userName:
 *                 type: string
 *                 example: John Doe
 *               category:
 *                 type: string
 *                 example: Feedback
 *               content:
 *                 type: string
 *                 example: This is my aspiration content
 *               status:
 *                 type: string
 *                 enum: [Pending, Reviewed, Resolved]
 *                 default: Pending
 *     responses:
 *       201:
 *         description: Aspiration created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aspiration'
 */
router.post("/", auth, AspirationController.createAspiration);

/**
 * @swagger
 * /v1/aspirations/{id}/status:
 *   patch:
 *     summary: Update aspiration status
 *     tags: [Aspirations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Aspiration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Reviewed, Resolved]
 *                 example: Reviewed
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 aspiration:
 *                   $ref: '#/components/schemas/Aspiration'
 *       404:
 *         description: Aspiration not found
 */
router.patch("/:id/status", auth, AspirationController.updateStatus);

/**
 * @swagger
 * /v1/aspirations/{id}:
 *   delete:
 *     summary: Delete aspiration
 *     tags: [Aspirations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Aspiration ID
 *     responses:
 *       200:
 *         description: Aspiration deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Aspiration not found
 */
router.delete("/:id", auth, AspirationController.deleteAspiration);

module.exports = router;
