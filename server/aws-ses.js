var aws = require('aws-sdk');

aws.config.loadFromPath('config.json');
var ses = new aws.SES({apiVersion: '2010-12-01'});

// this must relate to a verified SES account
var from = 'mark@fairhursts.net';

// to is an array
module.exports = {

    send: function (to, subject, bodyText, bodyHtml) {
        var params = {
            Destination: {
                ToAddresses: to
            },
            Message: {
                Body: {
                    Html: {
                        Data: bodyHtml
                    },
                    Text: {
                        Data: bodyText
                    }
                },
                Subject: {
                    Data: subject
                }
            },
            Source: from,
            // ReplyToAddresses: [
            //     'STRING_VALUE'
            // ],
            // ReturnPath: 'STRING_VALUE',
            // ReturnPathArn: 'STRING_VALUE',
            SourceArn: 'arn:aws:ses:us-west-2:473563352846:identity/fairhursts.net'
        };

        ses.sendEmail(params, function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
    }
};