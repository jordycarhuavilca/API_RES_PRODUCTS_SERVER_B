const model = require("../database/models/report_facturacion");
const { reportFact_repos } = require("../repos/reportFact.repos");
const { reportFact_serv } = require("../service/reportFact.service");

const reportFactRepository = new reportFact_repos(model);
const reportFactService = new reportFact_serv(reportFactRepository);


const addReportFact = async (req, res) => {
  try {
    const origin = req.headers.origin;
    console.log('Request from domain: ', origin);
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3004');
    const response = await reportFactService.addReportFact(req.body);
    res.status(200).json({ response: response });
  
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getReportFact = async (req, res) => {
  const origin = req.headers.origin;
  console.log('Request from domain: ', origin);
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const response = await reportFactService.getReportFact(req.params.dni);
    res.status(200).json({ response: response });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports = {
  addReportFact,
  getReportFact,
};
