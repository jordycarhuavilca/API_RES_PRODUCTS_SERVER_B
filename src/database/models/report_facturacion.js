const sequelize = require("../connection");
const { DataTypes } = require("sequelize");

const report_factu = sequelize.define(
  "report_factu",
  {
    report_factuId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cantidadProduct: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL,
    },
    dni: {
      type: DataTypes.STRING,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time : {
      type : DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    timestamps: false,
  }
);

module.exports = report_factu;
