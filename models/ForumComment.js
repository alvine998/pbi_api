const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ForumComment = sequelize.define("ForumComment", {
  forumId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = ForumComment;
