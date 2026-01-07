const { Poll, PollOption } = require("../models/Poll");

exports.createPoll = async (req, res) => {
  try {
    const { question, options, endDate } = req.body;
    const poll = await Poll.create({ question, endDate });

    if (options && Array.isArray(options)) {
      await Promise.all(
        options.map((opt) =>
          PollOption.create({ text: opt.text, PollId: poll.id })
        )
      );
    }

    const pollWithOpts = await Poll.findByPk(poll.id, { include: ["options"] });
    res.status(201).json(pollWithOpts);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
