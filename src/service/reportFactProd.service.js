class reportFactProduct_serv {
  constructor(ReportFactProd) {
    this.ReportFactProd = ReportFactProd;
  }
  async addReportFactProd(list,t) {
    return await this.ReportFactProd.addReportFactProd(list,t);
  }
}

module.exports = {
  reportFactProduct_serv,
};
