const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const PollController = require("../controllers/PollController");

/**
 * @swagger
 * /v1/polls:
 *   get:
 *     summary: List all polls
 *     tags: [Polls]
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
 *     responses:
 *       200:
 *         description: List of polls
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
 *                     $ref: '#/components/schemas/Poll'
 */
router.get("/", auth, PollController.listPolls);

/**
 * @swagger
 * /v1/polls/{id}:
 *   get:
 *     summary: Get poll by ID
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Poll'
 *       404:
 *         description: Poll not found
 */
router.get("/:id", auth, PollController.getPollById);

/**
 * @swagger
 * /v1/polls:
 *   post:
 *     summary: Create a new poll
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - options
 *             properties:
 *               question:
 *                 type: string
 *                 example: What is your favorite color?
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-02-01T00:00:00Z
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Red", "Blue", "Green"]
 *     responses:
 *       201:
 *         description: Poll created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Poll'
 */
router.post("/", auth, PollController.createPoll);

/**
 * @swagger
 * /v1/polls/{id}:
 *   put:
 *     summary: Update poll
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Poll ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Poll updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 poll:
 *                   $ref: '#/components/schemas/Poll'
 *       404:
 *         description: Poll not found
 */
router.put("/:id", auth, PollController.updatePoll);

/**
 * @swagger
 * /v1/polls/{id}:
 *   delete:
 *     summary: Delete poll
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Poll not found
 */
router.delete("/:id", auth, PollController.deletePoll);

module.exports = router;
