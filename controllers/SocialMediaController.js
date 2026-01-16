const SocialMedia = require("../models/SocialMedia");
const { logActivity } = require("../helpers/activityLogger");

exports.listSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findAll({
      order: [["sortOrder", "ASC"]],
    });
    res.json(socialMedia);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createSocialMedia = async (req, res) => {
  try {
    const { platform, url, icon, status, sortOrder } = req.body;
    const socialMedia = await SocialMedia.create({
      platform,
      url,
      icon,
      status,
      sortOrder,
    });

    await logActivity(
      req,
      "create",
      "SocialMedia",
      socialMedia.id,
      `Added social media platform: ${platform}`
    );
    res.status(201).json(socialMedia);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, url, icon, status, sortOrder } = req.body;

    const socialMedia = await SocialMedia.findByPk(id);
    if (!socialMedia) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Social media not found" });
    }

    await socialMedia.update({ platform, url, icon, status, sortOrder });
    await logActivity(
      req,
      "update",
      "SocialMedia",
      socialMedia.id,
      `Updated social media platform: ${platform}`
    );

    res.json({ message: "Social media updated successfully", socialMedia });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const socialMedia = await SocialMedia.findByPk(id);

    if (!socialMedia) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Social media not found" });
    }

    const platform = socialMedia.platform;
    await socialMedia.destroy();
    await logActivity(
      req,
      "delete",
      "SocialMedia",
      parseInt(id),
      `Deleted social media platform: ${platform}`
    );

    res.json({ message: "Social media deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
