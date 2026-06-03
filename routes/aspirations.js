const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const AspirationController = require("../controllers/AspirationController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/aspirations";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "attachment-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = file.mimetype.startsWith("image/");
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

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
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [laporan, aspirasi, inspirasi]
 *         description: Filter by type
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
router.get("/", AspirationController.listAspirations);

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
router.get("/:id", AspirationController.getAspirationById);

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - content
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [laporan, aspirasi, inspirasi]
 *                 example: aspirasi
 *               title:
 *                 type: string
 *                 example: Perbaikan layanan anggota
 *               content:
 *                 type: string
 *                 example: Mohon ditambahkan fitur pelacakan laporan.
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Aspiration created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aspiration'
 */
router.post(
  "/",
  auth,
  upload.single("attachment"),
  AspirationController.createAspiration
);

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
