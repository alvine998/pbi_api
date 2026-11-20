const { Op } = require("sequelize");
const KycSubmission = require("../models/KycSubmission");
const User = require("../models/User");
const { logActivity } = require("../helpers/activityLogger");

const ALLOWED_STATUSES = ["waiting", "approved", "rejected"];

const sanitizeUser = (user) => {
  const data = user.toJSON();
  delete data.password;
  return data;
};

const resolveUploadedImage = (req, fieldName) => {
  const uploaded = req.files && req.files[fieldName] && req.files[fieldName][0];
  if (uploaded) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}/uploads/${uploaded.filename}`;
  }
  return req.body[fieldName] ? String(req.body[fieldName]).trim() : "";
};

/**
 * Submit KYC data for admin approval (sets status to "waiting").
 */
exports.submitKyc = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "User not found" });
    }

    if (user.kycStatus === "approved" || user.isKycVerified) {
      return res.status(400).json({
        error: "Bad Request",
        message: "KYC is already approved",
      });
    }

    if (user.kycStatus === "waiting") {
      return res.status(400).json({
        error: "Bad Request",
        message: "KYC is already waiting for admin approval",
      });
    }

    const {
      nik = "",
      fullName = "",
      birthPlace = "",
      birthDate = "",
      gender = "",
      address = "",
      city = "",
      province = "",
    } = req.body;

    const ktpImage = resolveUploadedImage(req, "ktpImage");
    const selfieImage = resolveUploadedImage(req, "selfieImage");

    if (!/^\d{16}$/.test(String(nik).trim())) {
      return res.status(400).json({
        error: "Validation Error",
        message: "NIK must be 16 digits",
      });
    }

    const requiredFields = {
      fullName,
      birthPlace,
      birthDate,
      gender,
      address,
      city,
      province,
      ktpImage,
      selfieImage,
    };

    const missing = Object.entries(requiredFields)
      .filter(([, value]) => !String(value).trim())
      .map(([key]) => key);

    if (missing.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const submission = await KycSubmission.create({
      userId: user.id,
      nik: String(nik).trim(),
      fullName: String(fullName).trim(),
      birthPlace: String(birthPlace).trim(),
      birthDate: String(birthDate).trim(),
      gender: String(gender).trim(),
      address: String(address).trim(),
      city: String(city).trim(),
      province: String(province).trim(),
      ktpImage,
      selfieImage,
      status: "waiting",
    });

    await user.update({
      name: String(fullName).trim(),
      kycStatus: "waiting",
      isKycVerified: false,
      kycRejectionReason: null,
    });

    await logActivity(
      req,
      "submit_kyc",
      "KycSubmission",
      submission.id,
      `User ${user.email} submitted KYC for approval`
    );

    return res.status(201).json({
      message: "KYC submitted and waiting for admin approval",
      kyc: submission,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: error.message });
  }
};

/**
 * Get the authenticated user's current KYC status and latest submission.
 */
exports.getMyKyc = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "User not found" });
    }

    const submission = await KycSubmission.findOne({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      kycStatus: user.kycStatus || "unverified",
      isKycVerified: Boolean(user.isKycVerified),
      kycRejectionReason: user.kycRejectionReason || null,
      submission,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: error.message });
  }
};

/**
 * List KYC submissions for admin review.
 */
exports.listKyc = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "", search = "" } = req.query;
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const offset = (parsedPage - 1) * parsedLimit;

    const where = {};
    if (status) {
      const normalized = String(status).trim().toLowerCase();
      if (!ALLOWED_STATUSES.includes(normalized)) {
        return res.status(400).json({
          error: "Validation Error",
          message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`,
        });
      }
      where.status = normalized;
    }

    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { nik: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await KycSubmission.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone", "avatar", "kycStatus"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parsedLimit,
      offset,
    });

    return res.json({
      totalItems: count,
      totalPages: Math.ceil(count / parsedLimit),
      currentPage: parsedPage,
      items: rows,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: error.message });
  }
};

/**
 * Get a single KYC submission by ID (admin).
 */
exports.getKycById = async (req, res) => {
  try {
    const submission = await KycSubmission.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone", "avatar", "kycStatus"],
        },
      ],
    });

    if (!submission) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "KYC submission not found" });
    }

    return res.json(submission);
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: error.message });
  }
};

/**
 * Approve a KYC submission (admin).
 */
exports.approveKyc = async (req, res) => {
  try {
    const submission = await KycSubmission.findByPk(req.params.id);
    if (!submission) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "KYC submission not found" });
    }

    if (submission.status === "approved") {
      return res.status(400).json({
        error: "Bad Request",
        message: "KYC submission is already approved",
      });
    }

    await submission.update({
      status: "approved",
      rejectionReason: null,
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    });

    const user = await User.findByPk(submission.userId);
    if (user) {
      await user.update({
        kycStatus: "approved",
        isKycVerified: true,
        kycRejectionReason: null,
      });
    }

    await logActivity(
      req,
      "approve_kyc",
      "KycSubmission",
      submission.id,
      `Approved KYC submission #${submission.id} for user #${submission.userId}`
    );

    return res.json({
      message: "KYC approved successfully",
      kyc: submission,
      user: user ? sanitizeUser(user) : null,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: error.message });
  }
};

/**
 * Reject a KYC submission with a reason (admin).
 */
exports.rejectKyc = async (req, res) => {
  try {
    const submission = await KycSubmission.findByPk(req.params.id);
    if (!submission) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "KYC submission not found" });
    }

    const reason = String(
      req.body.reason || req.body.rejectionReason || ""
    ).trim();
    if (!reason) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Rejection reason is required",
      });
    }

    await submission.update({
      status: "rejected",
      rejectionReason: reason,
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    });

    const user = await User.findByPk(submission.userId);
    if (user) {
      await user.update({
        kycStatus: "rejected",
        isKycVerified: false,
        kycRejectionReason: reason,
      });
    }

    await logActivity(
      req,
      "reject_kyc",
      "KycSubmission",
      submission.id,
      `Rejected KYC submission #${submission.id} for user #${submission.userId}: ${reason}`
    );

    return res.json({
      message: "KYC rejected",
      kyc: submission,
      user: user ? sanitizeUser(user) : null,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: error.message });
  }
};
