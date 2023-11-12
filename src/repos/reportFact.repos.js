const report_factu_product = require("../database/models/report_facturacion_products");
const axios = require("axios");
const { Op } = require("sequelize");
const getProducts = async (numOrder) => {
  return await axios.get(
    `http://SERVER_A:3004/order/${numOrder}/getOrdersDetail`
  );
};

const fillDetails = async (listFact) => {
  try {
    //esto es un instancia de sequelize
    for (let i = 0; i < listFact.length; i++) {
      const numOrder = listFact[i].report_factu_products[0].numOrder;
      const res = await getProducts(numOrder);
      for (let j = 0; j < listFact[i].report_factu_products.length; j++) {
        const detalleFact = listFact[i].report_factu_products[j];
        const products = res.data.data;
        let productId = detalleFact.product_id;
        let productAndDetail = products.find(
          (product) => product.tbl_product["product_id"] === productId
        );
        //modificar un objeto instanciado por sequelize
        detalleFact.setDataValue("details", productAndDetail);
      }
    }
    return listFact;
  } catch (error) {
    console.log("error k " + error);
    throw error;
  }
};

class reportFact_repos {
  constructor(report_facturacion) {
    this.report_facturacion = report_facturacion;
  }
  async getNextReportId() {
    const list = await this.report_facturacion.findAll();
    if (list.length == 0) {
      return 1;
    }
    return (
      list.sort((a, b) => b.report_factuId - a.report_factuId)[0]
        .report_factuId + 1
    );
  }
  async addReportFact(report_facturacion, trans) {
    return await this.report_facturacion.create(report_facturacion, {
      transaction: trans,
    });
  }
  async getReportFact(dni, product_id, fechaInicio, fechaFin) {
    const whereClause = {};
    const whereClause2 = {};
    if (dni)whereClause.dni = dni;
    if (fechaInicio && fechaFin ) whereClause.fecha = { [Op.between]: [fechaInicio, fechaFin] };

    if (product_id )whereClause2.product_id = product_id;

    console.log("whereClause " + JSON.stringify(whereClause));
    const listReport = await this.report_facturacion.findAll({
      where: whereClause,
      include: [{
        model: report_factu_product,
        where : whereClause2
      }],
    });
    return await fillDetails(listReport);
  }
}
module.exports = {
  reportFact_repos,
};
