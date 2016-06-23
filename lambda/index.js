console.log('Loading function');

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

exports.handler = function(event, context) {
    console.log("\n\nLoading handler\n\n");
    var sns = new AWS.SNS();

    sns.publish({
        Message: 'Send result of ' + event.request + ' to ' + event.email,
        TopicArn: 'arn:aws:sns:region:id_number:topic'
    }, function(err, data) {
        if (err) {
            console.log(err.stack);
            return;
        }
        console.log('push sent');
        console.log(data);
        context.done(null, 'Request submitted! Expect an email within a couple of days.');
    });
};
