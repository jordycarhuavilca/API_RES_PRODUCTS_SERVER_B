const sequelize = require("../connection");
const { DataTypes } = require("sequelize");

const report_factu_product = sequelize.define(
  "report_factu_product",
  {
    report_factu_productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = report_factu_product;
