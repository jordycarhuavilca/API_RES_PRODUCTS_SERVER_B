const { stringify } = require("flatted");
const report_factu_product = require("../database/models/report_facturacion_products");
const axios = require("axios");

const getProducts = async (numOrder) => {
  return await axios.get(
    `http://SERVER_A:3004/order/${numOrder}/getOrdersDetail`
  );
};
const fillDetails = async (list) => {
  try {
    for (let i = 0; i < list.length; i++) {
      const numOrder = list[i].report_factu_products[0].numOrder;
      const res = await getProducts(numOrder);
      const productInstance = list[i].report_factu_products[0]
      productInstance.setDataValue('details', res.data.data); 
    }  
    return list;
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
  async getReportFact(dni) {
    const listReport = await this.report_facturacion.findAll({
      where: {
        dni: dni,
      },
      include: {
        model: report_factu_product,
      },
    });
    return await fillDetails(listReport);
  }
}
module.exports = {
  reportFact_repos,
};
