const request = require('../utils/request')

function addNextId(list,nextId,key) {
    for (let i = 0; i < list.length; i++) {
      list[i][key] = nextId;
    }
    return list;
}
 
const accumulator = (value, valueToCount) => {
    let count = 0;
    if (Array.isArray(value) && typeof value[0] === "object") {
      for (let i = 0; i < value.length; i++) {
        const object = value[i];
        count += object[valueToCount];
      }
      return count;
    } else {
      return 0;
    }
};

const getProducts = async(numOrder)=>{
 return await request.doRequest('get',`/order/${numOrder}/getOrdersDetail`)
}

const fillDetails = async (listFact) => {
    for (let i = 0; i < listFact.length; i++) {

      const numOrder = listFact[i].report_factu_products[0].numOrder;

      const res = await getProducts(numOrder);
      console.log(JSON.stringify(res))
      for (let j = 0; j < listFact[i].report_factu_products.length; j++) {

        const detalleFact = listFact[i].report_factu_products[j];
        const products = res.data;
        let productId = detalleFact.product_id;

        let productAndDetail = products.find(
          (product) => product.tbl_product["product_id"] === productId
        );

        //modificar un objeto instanciado por sequelize
        detalleFact.setDataValue("details", productAndDetail);
      }
    }
    return listFact;
};
  
  module.exports = {
    addNextId,
    accumulator,
    fillDetails
  }