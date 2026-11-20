const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const KycController = require("../controllers/KycController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `kyc-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
  },
});

/**
 * @swagger
 * /v1/kyc/submit:
 *   post:
 *     summary: Submit KYC verification data (sets status to waiting for admin approval)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nik
 *               - fullName
 *               - birthPlace
 *               - birthDate
 *               - gender
 *               - address
 *               - city
 *               - province
 *               - ktpImage
 *               - selfieImage
 *             properties:
 *               nik:
 *                 type: string
 *               fullName:
 *                 type: string
 *               birthPlace:
 *                 type: string
 *               birthDate:
 *                 type: string
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               province:
 *                 type: string
 *               ktpImage:
 *                 type: string
 *                 format: binary
 *               selfieImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: KYC submitted and waiting for admin approval
 *       400:
 *         description: Validation error or KYC already waiting/approved
 */
router.post(
  "/submit",
  auth,
  upload.fields([
    { name: "ktpImage", maxCount: 1 },
    { name: "selfieImage", maxCount: 1 },
  ]),
  KycController.submitKyc
);

/**
 * @swagger
 * /v1/kyc/me:
 *   get:
 *     summary: Get current user's KYC status and latest submission
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user KYC status
 */
router.get("/me", auth, KycController.getMyKyc);

/**
 * @swagger
 * /v1/kyc:
 *   get:
 *     summary: List all KYC submissions (Admin only)
 *     tags: [KYC]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [waiting, approved, rejected]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of KYC submissions
 *       403:
 *         description: Admin access required
 */
router.get("/", auth, admin, KycController.listKyc);

/**
 * @swagger
 * /v1/kyc/{id}:
 *   get:
 *     summary: Get KYC submission by ID (Admin only)
 *     tags: [KYC]
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
 *         description: KYC submission detail
 *       404:
 *         description: Not found
 */
router.get("/:id", auth, admin, KycController.getKycById);

/**
 * @swagger
 * /v1/kyc/{id}/approve:
 *   put:
 *     summary: Approve a KYC submission (Admin only)
 *     tags: [KYC]
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
 *         description: KYC approved
 *       404:
 *         description: Not found
 */
router.put("/:id/approve", auth, admin, KycController.approveKyc);

/**
 * @swagger
 * /v1/kyc/{id}/reject:
 *   put:
 *     summary: Reject a KYC submission (Admin only)
 *     tags: [KYC]
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
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: KYC rejected
 *       404:
 *         description: Not found
 */
router.put("/:id/reject", auth, admin, KycController.rejectKyc);

module.exports = router;
