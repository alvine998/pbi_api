const User = require("../models/User");

/**
 * Middleware to restrict access to admin users only.
 */
module.exports = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Authentication required" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user || !user.role || user.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden", message: "Admin access required" });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
