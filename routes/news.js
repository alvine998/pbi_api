const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const NewsController = require("../controllers/NewsController");

/**
 * @swagger
 * /v1/news:
 *   get:
 *     summary: List all news articles
 *     tags: [News]
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
 *         description: Search by title or content
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of news articles
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
 *                     $ref: '#/components/schemas/News'
 */
router.get("/", auth, NewsController.listNews);

/**
 * @swagger
 * /v1/news/{id}:
 *   get:
 *     summary: Get news by ID
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: News ID
 *     responses:
 *       200:
 *         description: News details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News not found
 */
router.get("/:id", auth, NewsController.getNewsById);

/**
 * @swagger
 * /v1/news:
 *   post:
 *     summary: Create a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Breaking News
 *               category:
 *                 type: string
 *                 example: Technology
 *               content:
 *                 type: string
 *                 example: This is the news content...
 *               status:
 *                 type: string
 *                 enum: [Draft, Published]
 *                 example: Published
 *               image:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: News created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 */
router.post("/", auth, NewsController.createNews);

/**
 * @swagger
 * /v1/news/{id}:
 *   put:
 *     summary: Update news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: News ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Draft, Published]
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: News updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 news:
 *                   $ref: '#/components/schemas/News'
 *       404:
 *         description: News not found
 */
router.put("/:id", auth, NewsController.updateNews);

/**
 * @swagger
 * /v1/news/{id}:
 *   delete:
 *     summary: Delete news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: News ID
 *     responses:
 *       200:
 *         description: News deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: News not found
 */
router.delete("/:id", auth, NewsController.deleteNews);

module.exports = router;
