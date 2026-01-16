const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SocialMedia = sequelize.define("SocialMedia", {
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = SocialMedia;
