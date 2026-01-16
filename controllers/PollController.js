const { Poll, PollOption } = require("../models/Poll");
const { Op } = require("sequelize");

exports.listPolls = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Poll.findAndCountAll({
      include: [{ model: PollOption, as: "options" }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      items: rows,
    });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.getPollById = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findByPk(id, {
      include: [{ model: PollOption, as: "options" }],
    });

    if (!poll) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Poll not found" });
    }

    res.json(poll);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createPoll = async (req, res) => {
  try {
    const { question, options, endDate } = req.body;
    const poll = await Poll.create({ question, endDate });

    if (options && Array.isArray(options)) {
      await Promise.all(
        options.map((opt) =>
          PollOption.create({
            text: typeof opt === "string" ? opt : opt.text,
            PollId: poll.id,
          })
        )
      );
    }

    const pollWithOpts = await Poll.findByPk(poll.id, { include: ["options"] });
    res.status(201).json(pollWithOpts);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, endDate, options } = req.body;

    const poll = await Poll.findByPk(id);
    if (!poll) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Poll not found" });
    }

    await poll.update({ question, endDate });

    // Update options if provided
    if (options && Array.isArray(options)) {
      // Delete existing options
      await PollOption.destroy({ where: { PollId: id } });
      // Create new options
      await Promise.all(
        options.map((opt) =>
          PollOption.create({
            text: typeof opt === "string" ? opt : opt.text,
            PollId: id,
          })
        )
      );
    }

    const updatedPoll = await Poll.findByPk(id, { include: ["options"] });
    res.json({ message: "Poll updated successfully", poll: updatedPoll });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findByPk(id);

    if (!poll) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Poll not found" });
    }

    // Delete associated options first
    await PollOption.destroy({ where: { PollId: id } });
    await poll.destroy();
    res.json({ message: "Poll deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
