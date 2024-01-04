const sequelizeConn = require("../database/connection");
const sequelize = require("sequelize");

const model = require("../database/models/report_facturacion_products");
const { reportFactProd_respos } = require("../repos/reportFactProd.repos");
const { reportFactProduct_serv } = require("../service/reportFactProd.service");
const reportHelper = require('../helper/reportHelper')
const handleCommonErr = require('../helper/handleCommonErrors')
const errorHandler = require('../helper/errorHandler')
const constant = require('../helper/constant')
const reportFactProdRepository = new reportFactProd_respos(model);

const reportFactProdService = new reportFactProduct_serv(
  reportFactProdRepository
);


class reportFact_serv {
  constructor(report_facturacion) {
    this.report_facturacion = report_facturacion;
  }
  async _addReportFact(body,t){
    return await this.report_facturacion.addReportFact(body, t);
  }
  async _addReportFactProd(data,t){
    let nextReportFactId = await handleCommonErr.handleErr(this.report_facturacion.getNextReportId());
    const list = reportHelper.addNextId(data, nextReportFactId,'report_factuId')
    return await reportFactProdService.addReportFactProd(list, t);
  }

  async doReportFact(data) {
    const { list, dni } = data;
    const IGV =  0.15
    const body = {
      cantidadProduct: reportHelper.accumulator(list, "quantity"),
      total: reportHelper.accumulator(list,"total"),
      subtotal: reportHelper.accumulator(list,"total") * IGV + reportHelper.accumulator(list,"total"),
      dni: dni,
    };
    const response = await handleCommonErr.handleErr(sequelizeConn.transaction(async (t) => {
      const report = await this._addReportFact(body, t);
      const reportProd = await this._addReportFactProd(list,t);
      report.setDataValue('reportFactProd',reportProd)
      return report
    }),sequelize.Error)

    return response
  }

  async getReportFact(params) {
    const report = await handleCommonErr.handleErr(this.report_facturacion.getReportFact(params),sequelize.Error);
    if (report.length == 0) {
      const {message,statusCode} = constant.recordNotFound
      throw new errorHandler.NotFoundError(message,statusCode)
    }
    return report;
  }
}

module.exports = {
  reportFact_serv,
};
