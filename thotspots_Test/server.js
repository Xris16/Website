var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var sendmail = require('sendmail')();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// serve all other pages
app.get(/^(.+)$/, function(req, res) {
    var page = req.params[0];
    if (fs.existsSync(path.join(__dirname + page))) {
        res.sendFile(path.join(__dirname + page));
    } else {
        res.redirect(path.join(__dirname + '/index.html'));
    }
});

app.post('/thank-you.html', function(req, res) {		// Post
    var user_message = req.body.content;
    var user_subject = req.body.subject;
    var email = req.body.email;
    var name = req.body.name;

    sendmail({
    	from: 'chris@thotspots.com',
    	to: 'chris@thotspots.com',
    	subject: email,
    	html: 'From: ' + name + '.<br> ' + user_message, // figure out how to skip line
    }, function(err, reply) {
    	console.log(err && err.stack);
    	console.dir(reply);
    });

    res.sendFile(path.join(__dirname + '/pages/thank-you.html'));

});

// host website on port 3000
app.listen(process.env.PORT || 3000, function () {
    console.log('app listening on port 3000');
});
