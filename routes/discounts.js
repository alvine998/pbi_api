const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const DiscountController = require("../controllers/DiscountController");

/**
 * @swagger
 * /v1/discounts:
 *   get:
 *     summary: List all discounts
 *     tags: [Discounts]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: query
 *         name: applicableTo
 *         schema:
 *           type: string
 *           enum: [all, category, product]
 *     responses:
 *       200:
 *         description: List of discounts
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
 *                     $ref: '#/components/schemas/Discount'
 */
router.get("/", DiscountController.listDiscounts);

/**
 * @swagger
 * /v1/discounts/active:
 *   get:
 *     summary: Get currently active discounts
 *     tags: [Discounts]
 *     responses:
 *       200:
 *         description: List of active discounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discount'
 */
router.get("/active", DiscountController.getActiveDiscounts);

/**
 * @swagger
 * /v1/discounts/{id}:
 *   get:
 *     summary: Get discount by ID
 *     tags: [Discounts]
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
 *         description: Discount details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       404:
 *         description: Discount not found
 */
router.get("/:id", DiscountController.getDiscountById);

/**
 * @swagger
 * /v1/discounts:
 *   post:
 *     summary: Create a new discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - discountValue
 *             properties:
 *               name:
 *                 type: string
 *                 example: Summer Sale
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 default: percentage
 *               discountValue:
 *                 type: number
 *                 example: 15
 *               minPurchase:
 *                 type: number
 *               maxDiscount:
 *                 type: number
 *               applicableTo:
 *                 type: string
 *                 enum: [all, category, product]
 *                 default: all
 *               applicableIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Discount created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 */
router.post("/", auth, DiscountController.createDiscount);

/**
 * @swagger
 * /v1/discounts/{id}:
 *   put:
 *     summary: Update discount
 *     tags: [Discounts]
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
 *               applicableTo:
 *                 type: string
 *                 enum: [all, category, product]
 *               applicableIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *       404:
 *         description: Discount not found
 */
router.put("/:id", auth, DiscountController.updateDiscount);

/**
 * @swagger
 * /v1/discounts/{id}:
 *   delete:
 *     summary: Delete discount
 *     tags: [Discounts]
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
 *         description: Discount deleted successfully
 *       404:
 *         description: Discount not found
 */
router.delete("/:id", auth, DiscountController.deleteDiscount);

module.exports = router;
