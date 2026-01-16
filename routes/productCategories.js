const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const ProductCategoryController = require("../controllers/ProductCategoryController");

// Configure multer for icon uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/categories";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "icon-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for icons
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

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
 *         multipart/form-data:
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
 *               icon:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 description: Image URL (if not uploading file)
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
router.post(
  "/",
  auth,
  upload.single("icon"),
  ProductCategoryController.createCategory
);

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 description: Image URL (if not uploading file)
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
router.put(
  "/:id",
  auth,
  upload.single("icon"),
  ProductCategoryController.updateCategory
);

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
