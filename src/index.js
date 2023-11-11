const app = require('./app')
const PORT =process.env.NODE_PORT
const sequelize = require('./database/connection')
const {report_factu,report_facturacion_products} = require('./database/association')


function startServer(){
    app.listen(PORT,()=>{
        console.log(`the server is running on PORT ${PORT}`)
    })
}


function authenticate(){
    try {
        sequelize.authenticate().then(()=>{
            sequelize.sync({force : true}).then(()=>{
                startServer()
            })
        })
    } catch (error) {
        console.log(error)
    }
}

authenticate()