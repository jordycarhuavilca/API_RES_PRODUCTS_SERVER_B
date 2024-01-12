const report_factu_product = require("../database/models/report_facturacion_products");
const reportHelper = require('../helper/reportHelper')
const sequelize = require("sequelize")
const handleCommonErr = require('../helper/handleCommonErrors')

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

  async getReportFact(params) {
    const whereClause = {};
    if (params.product_id ) whereClause["$report_factu_products.product_id$"] = params.product_id;
    if (params.dni) whereClause.dni = params.dni;
    if (params.fechaInicio && params.fechaFin ) whereClause.fecha = { [sequelize.Op.between]: [params.fechaInicio, params.fechaFin] };

    
    console.log("params "+ params)
    const listReport = await this.report_facturacion.findAll({
      where: whereClause,
      include: [{
        model: report_factu_product
      }],
    });
    return await handleCommonErr.handleErr(reportHelper.fillDetails(listReport), sequelize.Error);
  }
}
module.exports = {
  reportFact_repos,
};
