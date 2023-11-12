class reportFactProd_respos {
  constructor(ReportFactProd) {
    this.ReportFactProd = ReportFactProd;
  }
  async addReportFactProd(list,transaction) {
    return await this.ReportFactProd.bulkCreate(list,{transaction : transaction});
  }
}
module.exports = {
  reportFactProd_respos,
};
