const ActivityLog = require("../models/ActivityLog");

/**
 * Log an activity
 * @param {Object} req - Express request object
 * @param {string} action - Action performed (create, update, delete, login, etc.)
 * @param {string} entity - Entity type (User, Product, Transaction, etc.)
 * @param {number} entityId - ID of the entity
 * @param {string} target - Description of the target
 * @param {string} details - Additional details
 */
const logActivity = async (
  req,
  action,
  entity,
  entityId = null,
  target = null,
  details = null
) => {
  try {
    const userId = req.user?.id || null;
    const userName = req.user?.name || req.user?.email || "System";
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
    const userAgent = req.headers["user-agent"];

    await ActivityLog.create({
      userId,
      user: userName,
      action,
      entity,
      entityId,
      target,
      details: typeof details === "object" ? JSON.stringify(details) : details,
      ip,
      userAgent,
    });
  } catch (error) {
    console.error("Failed to log activity:", error.message);
  }
};

module.exports = { logActivity };
