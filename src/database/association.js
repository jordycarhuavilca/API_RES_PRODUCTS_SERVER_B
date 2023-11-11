const report_factu = require('./models/report_facturacion')
const report_facturacion_products = require('./models/report_facturacion_products')


report_factu.hasMany(report_facturacion_products,{foreignKey: 'report_factuId'})
report_facturacion_products.belongsTo(report_factu,{foreignKey: 'report_factuId'})


module.exports = {
    report_factu,
    report_facturacion_products
}