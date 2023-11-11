const sequelize = require("../database/connection");

const model = require("../database/models/report_facturacion_products");
const { reportFactProd_respos } = require("../repos/reportFactProd.repos");
const { reportFactProduct_serv } = require("../service/reportFactProd.service");

const reportFactProdRepository = new reportFactProd_respos(model);

const reportFactProdService = new reportFactProduct_serv(
  reportFactProdRepository
);

const acomulador = (value, valueToCount) => {
  let count = 0;
  if (Array.isArray(value) && typeof value[0] === "object") {
    for (let i = 0; i < value.length; i++) {
      const object = value[i];
      count += object[valueToCount];
    }
    return count;
  } else {
    return 0;
  }
};

class reportFact_serv {
  constructor(report_facturacion) {
    this.report_facturacion = report_facturacion;
  }
  async addReportFact(data) {
    const { list, dni, numOrder } = data;

    const body = {
      cantidadProduct: acomulador(list, "quantity"),
      total: acomulador(list, "price"),
      subtotal: acomulador(list, "price") * 0.05 + acomulador(list, "price"),
      dni: dni,
    };

    let nextReportFactId = await this.report_facturacion.getNextReportId();
    await sequelize.transaction(async (t) => {
      await this.report_facturacion.addReportFact(body, t);
      await reportFactProdService.addReportFactProd(
        { numOrder, report_factuId: nextReportFactId },
        t
      );
    });
  }
  async getReportFact(dni) {
    const report = await this.report_facturacion.getReportFact(dni);
    return report;
  }
}

module.exports = {
  reportFact_serv,
};
