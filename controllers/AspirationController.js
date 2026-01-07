const Aspiration = require("../models/Aspiration");

exports.listAspirations = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const items = await Aspiration.findAll({ where });
    res.json({ items });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const aspiration = await Aspiration.findByPk(id);
    if (!aspiration) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Aspiration not found" });
    }

    await aspiration.update({ status });
    res.json({ id, status, message: "Status updated successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
