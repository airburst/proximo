var nodemailer = require('nodemailer');
var config = require('config');

var user = config.get('gmail.user');
var pass = config.get('gmail.pass');
var from = '"Proximo App" <proximo@fairhursts.net>';

module.exports = {

    smtpConfig: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL 
        auth: {
            user: user,
            pass: pass
        }
    },

    transporter: nodemailer.createTransport(this.smtpConfig),

    createEmail: function (to, subject, text, html) {
        return {
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        };
    },

    send: function (to, subject, text, html) {
        this.transporter.sendMail(this.createEmail(to, subject, text, html), function (error, info) {
            if (error) { console.log({status: 'error', message: error}); return error; }
            console.log({status: 'ok', message: info});
            return info;
        });
    }

};
