console.log('Loading function');

var AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {
    console.log("\n\nLoading handler\n\n");
    var sns = new AWS.SNS();
    var requestBody = JSON.parse(event.body);
    sns.publish({
        Message: 'Send result of ' + requestBody.expression + ' to ' + requestBody.email,
        TopicArn: process.env.TOPIC_ARN
    }, function(err, data) {
        if (err) {
            console.log(err.stack);
            const reponse = {
              statusCode: 503,
              headers: {
              "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
              "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify({ "message": "Server error " + err.stack })
          };
          callback(null, response);
        }
        console.log(event);
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
          },
          body: JSON.stringify({ "message": "Request submitted! Expect an email within a couple of days." })
        };
        callback(null, response);
    });

};
