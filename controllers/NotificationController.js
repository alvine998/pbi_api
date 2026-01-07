const Notification = require("../models/Notification");

exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Notification not found" });
    }
    await notification.update({ status: "Read" });
    res.json({ id, status: "Read", message: "Notification marked as read" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
