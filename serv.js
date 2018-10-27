var express = require('express');
var Pusher = require('pusher');
var path = require('path');
var bodyParser = require("body-parser");
var fs = require("fs");
var upload = require("express-fileupload");

var pusher = new Pusher({
  appId: '616886',
  key: '861cada503bdd961e815',
  secret: 'a542ddc62ab5800362df',
  cluster: 'eu',
  encrypted: true
});

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(upload());


var lot_1 = {
  name: "YEEZY BOOST 350 V2 'ZEBRA'",
  url: 'https://raw.githubusercontent.com/Egor14/web/master/yeezy_zebra.png',
  price : 200,
  lotID: 0,
  time: "00:50"
};

var lot_2 = {
  name: "NIKE AIR JORDAN",
  url: 'https://raw.githubusercontent.com/Egor14/web/master/jordan.png',
  price : 100,
  lotID: 1,
  time: "00:50"
};

var lot_3 = {
  name: "NIKE AIR MAX",
  url: 'https://raw.githubusercontent.com/Egor14/web/master/air.png',
  price : 70,
  lotID: 2,
  time: "00:50"
};

var catalog = [lot_1, lot_2, lot_3];
var begin = [true, true, true];

var catalogJSON = JSON.stringify(catalog);

app.get('/', function(req, res) {
	res.render('index', {catalogJSON : catalogJSON});
});

app.get('/buy', function(req, res) {
	res.render('auction', {value : req.params.id});
});


app.get('/sell', function(req, res) {
	res.sendFile(__dirname + '/new-offer.html');
});

app.post('/filter', urlencodedParser, function (req, res) {
	console.log(req.body);
	res.redirect('/');
})

app.post('/place', urlencodedParser, function (req, res) {
  var imageID = String(catalog.length + 1);
  fs.writeFileSync("public/image" + imageID + ".png", req.files.basePhoto.data);
  var lot = {
    name: req.body.description,
    url: "/image" + imageID + ".png" 
  };
  catalog.push(lot);
  catalogJSON = JSON.stringify(catalog);
	res.redirect('/');
})

app.post('/update/:id', urlencodedParser, function (req, res) {
  pusher.trigger('my-channel', 'my-event', {
  "message": req.body.Price
  });
  catalog[req.params.id].price += Number(req.body.Price);
  res.redirect('/' + req.params.id);
})

app.get('/:id', function(req, res) {
  if (begin[req.params.id] == true) {
    startTimer(req.params.id);
    begin[req.params.id] = false;
  }
  res.render('auction', {shmot : catalog[req.params.id]});
});

function startTimer(option){
  currentTimer = catalog[option].time;
  var arr = currentTimer.split(':');
  var minutes = arr[0];
  var seconds = arr[1];
  if (minutes == 0 && seconds == 0){
    return;
  }
  else seconds -= 1;

  catalog[option].time = formatTime(minutes) + ":" + formatTime(seconds);

  setTimeout(startTimer, 1000, option);
}

function formatTime(time){
  time = Number.parseInt(time);
  if (time < 10) return "0" + time
  else return time
}


app.listen(3000);