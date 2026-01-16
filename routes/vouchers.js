const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const VoucherController = require("../controllers/VoucherController");

/**
 * @swagger
 * /v1/vouchers:
 *   get:
 *     summary: List all vouchers
 *     tags: [Vouchers]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by code or name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, expired]
 *     responses:
 *       200:
 *         description: List of vouchers
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
 *                     $ref: '#/components/schemas/Voucher'
 */
router.get("/", VoucherController.listVouchers);

/**
 * @swagger
 * /v1/vouchers/{id}:
 *   get:
 *     summary: Get voucher by ID
 *     tags: [Vouchers]
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
 *         description: Voucher details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       404:
 *         description: Voucher not found
 */
router.get("/:id", VoucherController.getVoucherById);

/**
 * @swagger
 * /v1/vouchers/code/{code}:
 *   get:
 *     summary: Validate and get voucher by code
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher code
 *     responses:
 *       200:
 *         description: Valid voucher details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       400:
 *         description: Voucher is invalid or expired
 *       404:
 *         description: Voucher not found
 */
router.get("/code/:code", VoucherController.getVoucherByCode);

/**
 * @swagger
 * /v1/vouchers:
 *   post:
 *     summary: Create a new voucher
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - discountValue
 *             properties:
 *               code:
 *                 type: string
 *                 example: SAVE20
 *               name:
 *                 type: string
 *                 example: Save 20% Discount
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 default: percentage
 *               discountValue:
 *                 type: number
 *                 example: 20
 *               minPurchase:
 *                 type: number
 *                 example: 100000
 *               maxDiscount:
 *                 type: number
 *                 example: 50000
 *               usageLimit:
 *                 type: integer
 *                 example: 100
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [active, inactive, expired]
 *     responses:
 *       201:
 *         description: Voucher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 */
router.post("/", auth, VoucherController.createVoucher);

/**
 * @swagger
 * /v1/vouchers/{id}:
 *   put:
 *     summary: Update voucher
 *     tags: [Vouchers]
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
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *               minPurchase:
 *                 type: number
 *               maxDiscount:
 *                 type: number
 *               usageLimit:
 *                 type: integer
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [active, inactive, expired]
 *     responses:
 *       200:
 *         description: Voucher updated successfully
 *       404:
 *         description: Voucher not found
 */
router.put("/:id", auth, VoucherController.updateVoucher);

/**
 * @swagger
 * /v1/vouchers/{id}:
 *   delete:
 *     summary: Delete voucher
 *     tags: [Vouchers]
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
 *         description: Voucher deleted successfully
 *       404:
 *         description: Voucher not found
 */
router.delete("/:id", auth, VoucherController.deleteVoucher);

module.exports = router;
