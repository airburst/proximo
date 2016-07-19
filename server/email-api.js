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
    next();
});

router.route('/email').post(function (req, res) {
    if (!(req.body.to)) { handleError(res, 'Invalid user input', 'Must provide an address to send to.', 400); }
    var to = req.body.to;
    if (!(req.body.subject)) { handleError(res, 'Invalid user input', 'Must provide a message subject.', 400); }
    var subject = req.body.subject;
    if (!(req.body.text)) { handleError(res, 'Invalid user input', 'Must provide a message subject.', 400); }
    var text = req.body.text;
    var html = req.body.text;
    if (req.body.html) { html = req.body.html; }

    var result = email.send(to, subject, text, html);
    res.json({message: 'Email sent to ' + req.body.to});
});

app.use('/', router);

// Start the server
app.listen(port);
console.log('Communications API listening on port ' + port);