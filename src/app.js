const Express = require('express')
const app = Express()
require('dotenv').config()
const morgan = require('morgan')

const router = require('./routes/reports.routes')
app.use(morgan('dev'))
app.use(Express.json())
app.use(Express.urlencoded({extended : true}))
app.use("/reports",router)
module.exports = app