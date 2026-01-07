const ActivityLog = require("../models/ActivityLog");

exports.getActivityLog = async (req, res) => {
  try {
    const items = await ActivityLog.findAll({ order: [["timestamp", "DESC"]] });
    res.json({ items });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
