const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const News = sequelize.define("News", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Published",
  },
  image: {
    type: DataTypes.STRING,
  },
});

module.exports = News;
