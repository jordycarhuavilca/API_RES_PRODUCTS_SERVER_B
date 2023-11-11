const {Router} = require('express')
const router = Router()
const {addReportFact,getReportFact} = require('../controller/reportFact.controller')
router.post('/add',addReportFact)
router.get('/:dni/getListReports',getReportFact)
module.exports = router