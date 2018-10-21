var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/buy', function(req, res) {
	res.sendFile(__dirname + '/auction.html');
});

app.get('/sell', function(req, res) {
	res.sendFile(__dirname + '/new-offer.html');
});

app.post('/filter', urlencodedParser, function (req, res) {
	console.log(req.body);
	res.redirect('/');
})


app.listen(3000);