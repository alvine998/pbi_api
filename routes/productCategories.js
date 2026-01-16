const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ProductCategoryController = require("../controllers/ProductCategoryController");

/**
 * @swagger
 * /v1/product/categories:
 *   get:
 *     summary: List all product categories
 *     tags: [Product Categories]
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
 *     responses:
 *       200:
 *         description: List of categories
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
 *                     $ref: '#/components/schemas/ProductCategory'
 */
router.get("/", auth, ProductCategoryController.listCategories);

/**
 * @swagger
 * /v1/product/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Product Categories]
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
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategory'
 *       404:
 *         description: Category not found
 */
router.get("/:id", auth, ProductCategoryController.getCategoryById);

/**
 * @swagger
 * /v1/product/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Product Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               parentId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategory'
 */
router.post("/", auth, ProductCategoryController.createCategory);

/**
 * @swagger
 * /v1/product/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Product Categories]
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
 *               image:
 *                 type: string
 *               parentId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put("/:id", auth, ProductCategoryController.updateCategory);

/**
 * @swagger
 * /v1/product/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Product Categories]
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
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/:id", auth, ProductCategoryController.deleteCategory);

module.exports = router;
