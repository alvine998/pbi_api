const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const DashboardController = require("../controllers/DashboardController");

/**
 * @swagger
 * /v1/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: integer
 *                     products:
 *                       type: integer
 *                     transactions:
 *                       type: integer
 *                     activeVouchers:
 *                       type: integer
 *                     categories:
 *                       type: integer
 *                 revenue:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     avgOrderValue:
 *                       type: number
 *                 today:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: integer
 *                     newUsers:
 *                       type: integer
 *                     revenue:
 *                       type: number
 */
router.get("/summary", DashboardController.getSummary);

/**
 * @swagger
 * /v1/dashboard/activities:
 *   get:
 *     summary: Get recent activities
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Recent activities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivityLog'
 */
router.get("/activities", DashboardController.getRecentActivities);

/**
 * @swagger
 * /v1/dashboard/transactions:
 *   get:
 *     summary: Get recent transactions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 */
router.get("/transactions", DashboardController.getRecentTransactions);

/**
 * @swagger
 * /v1/dashboard/chart/transactions:
 *   get:
 *     summary: Get transaction chart data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to include
 *     responses:
 *       200:
 *         description: Transaction chart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                       count:
 *                         type: integer
 *                       total:
 *                         type: number
 */
router.get("/chart/transactions", DashboardController.getTransactionChart);

/**
 * @swagger
 * /v1/dashboard/users/stats:
 *   get:
 *     summary: Get user statistics by role and status
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 byRole:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       role:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 byStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       count:
 *                         type: integer
 */
router.get("/users/stats", DashboardController.getUserStats);

module.exports = router;
