const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const KycSubmission = sequelize.define("KycSubmission", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nik: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthPlace: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ktpImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  selfieImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "waiting",
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

KycSubmission.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(KycSubmission, { foreignKey: "userId", as: "kycSubmissions" });

module.exports = KycSubmission;
