const model = require("../database/models/report_facturacion");
const { reportFact_repos } = require("../repos/reportFact.repos");
const { reportFact_serv } = require("../service/reportFact.service");
const reportFactRepository = new reportFact_repos(model);
const constant = require('../helper/constant')
const errorHandler = require('../helper/errorHandler')
const reportFactService = new reportFact_serv(reportFactRepository);

const addReportFact = async (req, res) => {
  try {
    res.header("Content-Type", "application/json");
    res.header("Access-Control-Allow-Origin", "http://localhost:3004");
    
    const body = req.body
    const {message,statusCode} = constant.reqValidationError
    if (typeof body != "object")throw new errorHandler.ValidateError("Only object is accepted",statusCode) 
    if (!body) throw new errorHandler.ValidateError(message,statusCode) 

    const data = await reportFactService.doReportFact(body);
    
    res.status(constant.reqCreated.statusCode).json({ message : constant.reqCreated.message,data });
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

const getReportFact = async (req, res) => {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "http://localhost:3004");

  try {
    const dni = req.query.dni || "";
    const productId = req.query.product_id || "";
    const fechaInicio = req.query.fechaInicio || "";
    const fechaFin = req.query.fechaFin || "";
    
    const params = {
      dni : dni,
      productId : productId,
      fechaInicio : fechaInicio,
      fechaFin : fechaFin
    }
    const data = await reportFactService.getReportFact(params);

    const {message,statusCode} = constant.success
    res.status(statusCode).json({ message,data });
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};
module.exports = {
  addReportFact,
  getReportFact,
};
