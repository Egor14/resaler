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
app.use('/auction/:id/',express.static(__dirname + '/public'));

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
            var catalogJSON = JSON.stringify(catalog);
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


  /*fs.writeFileSync("public/image" + 15 + ".jpg", req.files.basePhoto[0].data);
  fs.writeFileSync("public/image" + 16 + ".jpg", req.files.basePhoto[1].data);
  fs.writeFileSync("public/image" + 17 + ".jpg", req.files.basePhoto[2].data);

  console.log(req.files.basePhoto[0].data);
  console.log(req.files.basePhoto[1].data);
  console.log(req.files.basePhoto[2].data);


  main = true

  res.redirect('/');*/

  var main = true;
  var max = 0;
  var number = 0;

  /*pool.connect(function (err, client, done) {
       client.query('select max(images.img_id) from images;', function (err, result) {
            max = Number(result.rows[0].max + 1);
            client.query('INSERT INTO lots(lot_id, user_id, brand, comment, time, price, gender, category, swap, country, city, size, condition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);', 
                      [max, 1, req.body.brand, req.body.description, req.body.time, Number(req.body.startPriceSell), true, req.body.category, true, req.body.country, req.body.city, req.body.bootsSize, req.body.state], 
                          function (err, result) {
                            //console.log(main);
                //for (i = 0; i<req.files.basePhoto.length; i++) {
                //  if (i>0) {main = false;}
                  client.query('INSERT INTO images(lot_id, ismain) VALUES($1, $2), ($3, $4), ($5, $6);', [max, main, max, false, max, false], function(err, result) {
                       fs.writeFileSync("public/image" + Number(max) + ".jpg", req.files.basePhoto[0].data);
                       fs.writeFileSync("public/image" + Number(max + 1)+ ".jpg", req.files.basePhoto[1].data);
                       fs.writeFileSync("public/image" + Number(max + 2) + ".jpg", req.files.basePhoto[2].data);
                       done();
                       //res.redirect('/');
                  })
                  //res.redirect('/');
                  //main = false;
                  //client.query('INSERT INTO images(lot_id, ismain) VALUES($1, $2);', [max, main]);
                  //client.query('INSERT INTO images(lot_id, ismain) VALUES($1, $2);', [max, main]);
                  //number = max + i;
                  //fs.writeFileSync("public/image" + 12 + ".jpg", req.files.basePhoto[i].data);
                  //fs.writeFileSync("public/image" + 13 + ".jpg", req.files.basePhoto[i].data);
                  //fs.writeFileSync("public/image" + 14 + ".jpg", req.files.basePhoto[i].data);
                //}
                //done()
                //res.redirect('/');
          })
       })
   })*/

   /*pool.connect(function (err, client, done) {
       client.query('select max(images.img_id) from images;', function (err, result) {
            var max = Number(result.rows[0].max + 1);
            fs.writeFileSync("public/image" + max + ".jpg", req.files.basePhoto[0].data);
            fs.writeFileSync("public/image" + Number(max + 1) + ".jpg", req.files.basePhoto[1].data);
            fs.writeFileSync("public/image" + Number(max + 2) + ".jpg", req.files.basePhoto[2].data);
            client.query('INSERT INTO lots(lot_id, user_id, brand, comment, time, price, gender, category, swap, country, city, size, condition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);', 
                      [max, 1, req.body.brand, req.body.description, req.body.time, Number(req.body.startPriceSell), true, req.body.category, true, req.body.country, req.body.city, req.body.bootsSize, req.body.state], 
                          function (err, result) {
                client.query('INSERT INTO images(lot_id, ismain) VALUES ($1, $2), ($3, $4), ($5, $6);', [max, true, max+1, false, max+2, false], function (err, result) {
              done()
                res.redirect('/');
              })
          })
       })
   })*/



   pool.connect(function (err, client, done) {
    client.query('select max(lots.lot_id) from lots;', function (err, result) {
      counter = result.rows[0].max + 1;
       client.query('select max(images.img_id) from images;', function (err, result) {
            max = result.rows[0].max + 1;
            for (i=0; i<req.files.basePhoto.length; i++){
               fs.writeFileSync("public/image" + Number(max + i) + ".jpg", req.files.basePhoto[i].data);
            }
            //fs.writeFileSync("public/image" + Number(max) + ".jpg", req.files.basePhoto[0].data);
            //fs.writeFileSync("public/image" + Number(max + 1) + ".jpg", req.files.basePhoto[1].data);
            //fs.writeFileSync("public/image" + Number(max + 2) + ".jpg", req.files.basePhoto[2].data);
            client.query('INSERT INTO lots(user_id, brand, comment, time, price, gender, category, swap, country, city, size, condition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);', 
                      [1, req.body.brand, req.body.description, req.body.time, Number(req.body.startPriceSell), true, req.body.category, true, req.body.country, req.body.city, req.body.bootsSize, req.body.state], 
                          function (err, result) {
                            console.log(max);
                for (i=0; i<req.files.basePhoto.length; i++){
                  if (i>0) main = false;
                   client.query('INSERT INTO images(lot_id, ismain) VALUES($1, $2);', [counter, main], function (err, result) {
              })
               }
               done()
                  res.redirect('/');
          })
       })
   })
  })



})

app.post('/update/:id', urlencodedParser, function (req, res) {
  pusher.trigger('my-channel', 'my-event', {
  "message": req.body.Price
  });

  pool.connect(function (err, client, done) {
       client.query('update lots set price = price + $1 where lot_id = $2;', [Number(req.body.Price), Number(req.params.id)], function (err, result) {
      done()
            res.redirect('/auction/' + req.params.id);
       })
   })
})

app.get('/auction/:id', function(req, res) {
  if (begin[Number(req.params.id)] == true) {
    startTimer(req.params.id);
    begin[req.params.id] = false;
  }
  console.log(req.params.id);
  pool.connect(function (err, client, done) {
       client.query('select * from lots, images where lots.lot_id = images.lot_id and lots.lot_id = $1;', [Number(req.params.id)], function (err, result) {
      done()
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