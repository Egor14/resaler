var express = require('express');
var Pusher = require('pusher');
var path = require('path');
var bodyParser = require("body-parser");
var fs = require("fs");
var upload = require("express-fileupload");
const pg  = require('pg');

var pusher = new Pusher({
  appId: '616886',
  key: '861cada503bdd961e815',
  secret: 'a542ddc62ab5800362df',
  cluster: 'eu',
  encrypted: true
});

var app = express();

const config = {
    user: 'postgres',
    database: 'resaler_DB',
    password: '178gz90Gruny19',
    port: 5432
};

const pool = new pg.Pool(config);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(upload());


var begin = [true, true, true, true, true];


app.get('/', function(req, res) {
  pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query('select * from lots, images where lots.lot_id = images.lot_id and images.ismain = true;', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            var catalog = result.rows;
            /*for (i = 0; i < catalog.length; i++) {
              catalog[i].url = 'https://raw.githubusercontent.com/Egor14/web/master/yeezy_zebra.png'
            }*/
            var catalogJSON = JSON.stringify(catalog);
            //console.log(result.rows);
            res.render('index', {catalogJSON : catalogJSON});
       })
   })
});


app.get('/sell', function(req, res) {
	res.sendFile(__dirname + '/new-offer.html');
});

app.post('/filter', urlencodedParser, function (req, res) {
	console.log(req.body);
	res.redirect('/');
})

app.post('/place', urlencodedParser, function (req, res) {
  //var imageID = String(catalog.length + 1);
  //fs.writeFileSync("public/image" + imageID + ".png", req.files.basePhoto.data);

  console.log(req.files.basePhoto.data);
  //res.redirect('/');

  pool.connect(function (err, client, done) {
       client.query('select count(images.img_id) from images;', function (err, result) {
            fs.writeFileSync("public/image" + result.rows[0].count + ".jpg", req.files.basePhoto.data);
            client.query('INSERT INTO lots(user_id, brand, comment, time, price, gender, category, swap, country, city, size, condition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);', 
                      [1, req.body.brand, req.body.description, req.body.time, Number(req.body.startPriceSell), true, req.body.category, true, req.body.country, req.body.city, req.body.bootsSize, req.body.state], 
                          function (err, result) {
                client.query('INSERT INTO images(lot_id, ismain) VALUES($1, $2);', [7, true], function (err, result) {
              done()
                res.redirect('/');
              })
          })
       })
   })

  //select count(images.img_id) from images;
  /*var lot = {
    name: req.body.description,
    url: "/image" + imageID + ".png", 
    price: Number(req.body.startPriceSell),
    time: req.body.time,
    lotID: catalog.length
  };
  console.log(req.body);
  catalog.push(lot);*/


  //begin.push(true);
  //catalogJSON = JSON.stringify(catalog);


  /*mass = [1, req.body.brand, req.body.description, req.body.time, Number(req.body.startPriceSell), true, req.body.category, true, req.body.country, req.body.city, req.body.bootsSize, req.body.state];
  pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query('INSERT INTO lots(user_id, brand, comment, time, price, gender, category, swap, country, city, size, condition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);', mass, function (err, result) {
      done()
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.redirect('/');
       })
   })*/
})

app.post('/update/:id', urlencodedParser, function (req, res) {
  pusher.trigger('my-channel', 'my-event', {
  "message": req.body.Price
  });
  //catalog[req.params.id].price += Number(req.body.Price);

  pool.connect(function (err, client, done) {
       client.query('update lots set price = price + $1 where lot_id = $2;', [Number(req.body.Price), Number(req.params.id)], function (err, result) {
      done()
            res.redirect('/' + req.params.id);
       })
   })
})

app.get('/:id', function(req, res) {
  if (begin[Number(req.params.id)] == true) {
    startTimer(req.params.id);
    begin[req.params.id] = false;
  }

  pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query('select * from lots, images where lots.lot_id = images.lot_id and lots.lot_id = $1;', [Number(req.params.id)], function (err, result) {
      done()
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.render('auction', {shmot : result.rows});
       })
   })
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