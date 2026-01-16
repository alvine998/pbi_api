const Event = require("../models/Event");
const { Op } = require("sequelize");
const { logActivity } = require("../helpers/activityLogger");

exports.listEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (category) {
      where.category = category;
    }
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["date", "ASC"]],
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

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      image,
      category,
      status,
    } = req.body;
    const createdBy = req.user ? req.user.id : null;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      image,
      category,
      status,
      createdBy,
    });

    await logActivity(
      req,
      "create",
      "Event",
      event.id,
      `Created event: ${event.title}`
    );

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      time,
      location,
      image,
      category,
      status,
    } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Event not found" });
    }

    await event.update({
      title,
      description,
      date,
      time,
      location,
      image,
      category,
      status,
    });

    await logActivity(
      req,
      "update",
      "Event",
      event.id,
      `Updated event: ${event.title}`
    );

    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Event not found" });
    }

    const title = event.title;
    await event.destroy();
    await logActivity(
      req,
      "delete",
      "Event",
      parseInt(id),
      `Deleted event: ${title}`
    );

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
