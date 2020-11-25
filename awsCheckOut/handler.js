const AWS = require('aws-sdk');
const stripe = require('stripe')('sk_test_51HlaLCL53UtpCrjBXVpdT5gLPC6uN66A38APujAGbxAzDQ7JwP9uc2QlfSSTAWQcd8kC4XvH0X1VYc4sZf5aTKGx00DelMpIJf');

// Criação do Response
function response(statusCode, message) {
  return {
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    },
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

// Checkout Produtos
module.exports.checkoutSession = (event, context, callback) => {
  
  const products = [];
  const reqBody = JSON.parse(event.body);

  reqBody.forEach(item => {
    const data = {};
    data.amount = parseFloat(item.productValue * 100);
    data.quantity = item.Qtn;
    data.currency = "brl";
    data.description = item.productDescription;
    data.name = item.productName

    products.push(data)
  });
  console.log(products)
  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: products,
    mode: 'payment',
    success_url: 'https://base-app-test.s3-sa-east-1.amazonaws.com/index.html#/home',
    cancel_url: 'https://base-app-test.s3-sa-east-1.amazonaws.com/index.html#/carrinhocompras',
  }).then((data) => {
    callback(null, response(200, data))
  })
}