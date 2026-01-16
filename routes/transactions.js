const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TransactionController = require("../controllers/TransactionController");

/**
 * @swagger
 * /v1/transactions:
 *   get:
 *     summary: List all transactions
 *     tags: [Transactions]
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
 *           default: 10
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, cancelled]
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [pending, paid, failed, refunded]
 *     responses:
 *       200:
 *         description: List of transactions
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
 *                     $ref: '#/components/schemas/Transaction'
 */
router.get("/", auth, TransactionController.listTransactions);

/**
 * @swagger
 * /v1/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
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
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 */
router.get("/:id", auth, TransactionController.getTransactionById);

/**
 * @swagger
 * /v1/transactions/number/{transactionNumber}:
 *   get:
 *     summary: Get transaction by transaction number
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction number (e.g., TRX202601160001)
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 */
router.get(
  "/number/:transactionNumber",
  auth,
  TransactionController.getTransactionByNumber
);

/**
 * @swagger
 * /v1/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - items
 *               - subtotal
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: integer
 *                 example:
 *                   - productId: 1
 *                     name: Product A
 *                     price: 50000
 *                     quantity: 2
 *               subtotal:
 *                 type: number
 *                 example: 100000
 *               discountAmount:
 *                 type: number
 *                 example: 10000
 *               voucherCode:
 *                 type: string
 *                 example: SAVE20
 *               tax:
 *                 type: number
 *                 example: 11000
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, credit_card, debit_card, e_wallet, bank_transfer]
 *                 example: e_wallet
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
router.post("/", auth, TransactionController.createTransaction);

/**
 * @swagger
 * /v1/transactions/{id}:
 *   put:
 *     summary: Update transaction status
 *     tags: [Transactions]
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
 *               status:
 *                 type: string
 *                 enum: [pending, processing, completed, cancelled]
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed, refunded]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 */
router.put("/:id", auth, TransactionController.updateTransaction);

/**
 * @swagger
 * /v1/transactions/{id}:
 *   delete:
 *     summary: Delete transaction
 *     tags: [Transactions]
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
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
router.delete("/:id", auth, TransactionController.deleteTransaction);

module.exports = router;
