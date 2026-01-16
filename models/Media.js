const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Media = sequelize.define("Media", {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalname: {
    type: DataTypes.STRING,
  },
  mimetype: {
    type: DataTypes.STRING,
  },
  size: {
    type: DataTypes.INTEGER,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("image", "video", "document", "audio", "other"),
    defaultValue: "other",
  },
  userId: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Media;
