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

const addReport_factuId = (list, id) => {
  list.forEach((obj) => {
    obj.report_factuId = id;
  });
  return list;
};

class reportFact_serv {
  constructor(report_facturacion) {
    this.report_facturacion = report_facturacion;
  }
  async addReportFact(data) {
    const { list, dni } = data;

    const body = {
      cantidadProduct: acomulador(list, "quantity"),
      total: acomulador(list,"total"),
      subtotal: acomulador(list,"total") * 0.05 + acomulador(list,"total"),
      dni: dni,
    };
    let nextReportFactId = await this.report_facturacion.getNextReportId();
    await sequelize.transaction(async (t) => {
      await this.report_facturacion.addReportFact(body, t);
      await reportFactProdService.addReportFactProd(
        addReport_factuId(list, nextReportFactId),
        t
      );
    });
  }

  async getReportFact(dni, productId, fechaInicio, fechaFin) {
    const report = await this.report_facturacion.getReportFact(
      dni,
      productId,
      fechaInicio,
      fechaFin
    );
    return report;
  }
}

module.exports = {
  reportFact_serv,
};
