class reportFactProduct_serv {
  constructor(ReportFactProd) {
    this.ReportFactProd = ReportFactProd;
  }
  async addReportFactProd(ReportFactProd,t) {
    return await this.ReportFactProd.addReportFactProd(ReportFactProd,t);
  }
}

module.exports = {
  reportFactProduct_serv,
};
