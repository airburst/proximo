var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var email = require('./email');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var port = process.env.PORT || 8888;

function handleError(res, reason, message, code) {
    console.log('ERROR: ' + reason);
    res.status(code || 500).json({'error': message});
}

var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    //console.log('Something is happening.');
    next();
});

router.route('/email').post(function (req, res) {
    var to = 'mark@fairhursts.net';
    var group = '12345';
    // var subject = 'Share your location with Mark';
    // var bodyText = 'Hi,\n\nHow are you today?\n\nFrom Proximo';
    // var bodyHtml = '<p>Hi,</p><p>How are you today?</p><p>From Proximo</p>';

    if (!(req.body.to)) {
        handleError(res, 'Invalid user input', 'Must provide an address to send to.', 400);
    }

    var result = email.send(to, group);
console.log(result);
    res.json({message: 'Email sent to ' + req.body.to});
});

app.use('/', router);

// Start the server
app.listen(port);
console.log('Communications API listening on port ' + port);