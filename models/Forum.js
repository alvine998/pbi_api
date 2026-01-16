const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Forum = sequelize.define("Forum", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  commentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("active", "closed", "archived"),
    defaultValue: "active",
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Forum;
