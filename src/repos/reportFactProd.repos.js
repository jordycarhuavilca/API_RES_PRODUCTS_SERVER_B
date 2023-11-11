class reportFactProd_respos {
  constructor(ReportFactProd) {
    this.ReportFactProd = ReportFactProd;
  }
  async addReportFactProd(ReportFactProd,transaction) {
    return await this.ReportFactProd.create(ReportFactProd,{transaction});
  }
}
module.exports = {
  reportFactProd_respos,
};
