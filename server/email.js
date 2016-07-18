var nodemailer = require('nodemailer');

module.exports = {

    smtpConfig: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL 
        auth: {
            user: 'airburst8@gmail.com',
            pass: 'PASS'
        }
    },

    transporter: nodemailer.createTransport(this.smtpConfig),

    createEmailTemplate: function (to, groupId) {
        return {
            from: '"Proximo App" <proximo@fairhursts.net>',
            to: to,
            subject: 'You are invited to join a Proximo group',
            text: this.textBody(groupId),
            html: this.htmlBody(groupId)
        };
    },

    textBody: function (groupId) {
        return 'Hi,\n\n' +
            'You have been invited to join a group so that you can see each other\'s position on a map.\n\n' +
            'All you have to do is use the link below in your browser:\n\n' +
            'http://proximo.fairhursts.net?group=' + groupId + '\n\n' +
            'Enjoy!';
    },

    htmlBody: function (groupId) {
        return '<p>Hi,</p>' +
        '<p>You have been invited to join a group so that you can see each other\'s position on a map.</p>' +
        '<p>All you have to do is use the link below in your browser:</p>' +
        '<p><a href="http://proximo.fairhursts.net?group=' + groupId + '" title="Proximo group link">http://proximo.fairhursts.net?group=' + groupId + '</a></p>' +
        '<p>Enjoy!</p>';
    },

    send: function (to, groupId) {
        this.transporter.sendMail(this.createEmailTemplate(to, groupId), function (error, info) {
            if (error) { console.log({status: 'error', message: error}); return error; }
            console.log({status: 'ok', message: info});
            return info;
        });
    }

};
