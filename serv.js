var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


var lot_1 = {
  name: "YEEZY BOOST 350 V2 'ZEBRA'",
  url: 'https://raw.githubusercontent.com/Egor14/web/master/yeezy_zebra.png',
  price : 200,
  lotID: 1,
  time: "00:50"
};

var lot_2 = {
  name: "NIKE AIR JORDAN",
  url: 'https://raw.githubusercontent.com/Egor14/web/master/jordan.png',
  price : 100,
  lotID: 2,
  time: "00:50"
};

var lot_3 = {
  name: "NIKE AIR MAX",
  url: 'https://raw.githubusercontent.com/Egor14/web/master/air.png',
  price : 70,
  lotID: 3,
  time: "00:50"
};

var catalog = [lot_1, lot_2, lot_3];

var catalogJSON = JSON.stringify(catalog);

console.log(catalog);


app.get('/', function(req, res) {
	res.render('index', {catalogJSON : catalogJSON});
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