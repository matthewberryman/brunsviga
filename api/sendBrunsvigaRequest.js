console.log('Loading function');

const AWS = require('aws-sdk');

const valid = function(expression) {

  const operators = /[\+-/\*]/;

  return operators.test(expression) &&  // must have an operator
    expression.split(operators).length === 2 && // must have two operands
    expression.split(operators)[0].length <= 10 && /\d+/.test(expression.split(operators)[0]) && // operands must be numbers of length < 10
    expression.split(operators)[1].length <= 10 && /\d+/.test(expression.split(operators)[1]) &&
    !((Number(expression.split(operators)[1]) === 0) && operators.exec(expression)[0] === '/'); // can't divide by 0

}

exports.handler = async function(event, context, callback) {
  console.log("\n\nLoading handler\n\n");
  var sns = new AWS.SNS();
  var requestBody = JSON.parse(event.body);
  if (valid(requestBody.expression)) {
    try {
      const data = await sns.publish({
        Message: 'Send result of ' + requestBody.expression + ' to ' + requestBody.email,
        TopicArn: process.env.TOPIC_ARN
      }).promise();
      console.log(data);
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({ "message": "Request submitted! Expect an email within a couple of days." })
      };
      callback(null, response);
    }
    catch (err) {
      console.log(err.stack);
      const response = {
        statusCode: 503,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({ "message": "Server error " + err.stack })
      };
      callback(null, response);
    }
  } else {
    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ "message": "invalid request" })
    };
    callback(null, response);
  }
};
