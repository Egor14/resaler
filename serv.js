var express = require('express');
require('dotenv').load();
var Pusher = require('pusher');
var path = require('path');
var bodyParser = require("body-parser");
var fs = require("fs");
var upload = require("express-fileupload");
const pg  = require('pg');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');


var pusher = new Pusher({
  appId: '616886',
  key: '861cada503bdd961e815',
  secret: 'a542ddc62ab5800362df',
  cluster: 'eu',
  encrypted: true
});

var app = express();

app.use(cookieParser());

//console.log(process.env.PASS);
//console.log(process.env.secret);
//console.log(process.env.key);


const config = {
    user: 'postgres',
    database: 'resaler2',
    password: '178gz90Gruny19',
    port: 5432
};

const pool = new pg.Pool(config);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/auction/:id/',express.static(__dirname + '/public'));

app.use(upload());


/*var passwordFromUser = "test_user_pass";
 
// создаем соль
var salt = bcrypt.genSaltSync(10);
 
// шифруем пароль
var passwordToSave = bcrypt.hashSync(passwordFromUser, salt)
 
// выводим результат
console.log(salt);
console.log(passwordFromUser);
console.log(passwordToSave);*/



//var begin = [true, true, true, true, true];


app.get('/', function(req, res) {
  console.log(req.cookies);
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
            if (req.cookies.name == undefined) {
              res.render('index', {catalogJSON : catalogJSON, info : '', money : ''});
            }
            else {
                res.render('index', {catalogJSON : catalogJSON, info : req.cookies.name, money : req.cookies.cash});
            }
       })
   })
});


app.get('/sell', function(req, res) {
  if (req.cookies.user_id == undefined) {
    res.redirect('/sign');
  }
  else {

      pool.connect(function (err, client, done) {
        client.query('select * from cities;', function (err, result) {
            var cities = result.rows; 
            client.query('select * from sizes;', function (err, result) {
                var sizes = result.rows; 
                client.query('select * from conditions;', function (err, result) {
                  var conditions = result.rows;  
                  client.query('select * from brands;', function (err, result) {
                    var brands = result.rows;  
                    client.query('select * from categories;', function (err, result) {
                      var categories = result.rows;  
                      client.query('select * from globals;', function (err, result) {
                        var globals = result.rows; 
                        done();
                        res.render('new-offer', {cities : cities, sizes : sizes, conditions : conditions, brands : brands, categories : categories, globals : globals});
                      })     
                    })     
                  })     
                })      
            })      
        })

      /*client.query('select * from cities;', function (err, result) {
                        var cities = result.rows;       
                      })    

      client.query('select * from sizes;', function (err, result) {
                        var sizes = result.rows;       
                      })    

      client.query('select * from conditions;', function (err, result) {
                        var conditions = result.rows;       
                      })    

      client.query('select * from cities;', function (err, result) {
                        var cities = result.rows;       
                      })    

      client.query('select * from cities;', function (err, result) {
                        var cities = result.rows;       
                      })    

      client.query('select * from cities;', function (err, result) {
                        var cities = result.rows;       
                      })   */ 


     })


      //res.render('new-offer');
  }
});

app.get('/out', function(req, res) {
  res.clearCookie('name');
  res.clearCookie('user_id');
  res.clearCookie('cash');
  res.redirect('/');
});

app.get('/log', function(req, res) {
  res.sendFile(__dirname + '/log.html');
});

app.post('/login', urlencodedParser, function(req, res) {
  pool.connect(function (err, client, done) {
    client.query('select * from users where users.login = $1 and users.pass = $2', [req.body.email, req.body.password], function (err, result) {

        done()
        if (result.rows.length == 0) {
            res.sendFile(__dirname + '/log.html');
        }
        else {
            res.cookie('user_id', result.rows[0].user_id, {expires: new Date(Date.now() + 3000000), httpOnly: true});
            res.cookie('name', result.rows[0].name, {expires: new Date(Date.now() + 3000000), httpOnly: true});
            res.cookie('cash', result.rows[0].cash, {expires: new Date(Date.now() + 3000000), httpOnly: true});
            console.log(res.cookie);
            res.redirect('/');
        }
    })
  })
});

app.post('/signin', urlencodedParser, function(req, res) {
  pool.connect(function (err, client, done) {
    client.query('select login from users where users.login = $1', [req.body.email], function (err, result) {
      done()
        if (result.rows.length == 0) {
            client.query('INSERT INTO users(name, login, link, cash, pass) VALUES($1, $2, $3, $4, $5);', [req.body.name, req.body.email, req.body.link, req.body.cash, req.body.password], function (err, result) {
              res.redirect('/');
                })
        }
        else {
          res.sendFile(__dirname + '/sign.html');
        }
    })
  })
});

app.get('/sign', function(req, res) {
  res.sendFile(__dirname + '/sign.html');
});

app.post('/filter', urlencodedParser, function (req, res) {
	console.log(req.body);
	res.redirect('/');
})

app.post('/place', urlencodedParser, function (req, res) {




  var main = true;
  var max = 0;
  var number = 0;


   console.log(req.body);



   if (req.body.sex == 0) {
    var gender = false;
   }
   else {
    var gender = true;
   }

   if (req.body.swap == 'exchange') {
    var swap = true;
   }
   else {
    var swap = false;
   }






   pool.connect(function (err, client, done) {
    client.query('BEGIN', function (err, result) {
      client.query('select max(lots.lot_id) from lots;', function (err, result) {
        counter = result.rows[0].max + 1;
         client.query('select max(images.img_id) from images;', function (err, result) {
              max = result.rows[0].max + 1;
              for (i=0; i<req.files.basePhoto.length; i++){
                 fs.writeFileSync("public/image" + Number(max + i) + ".jpg", req.files.basePhoto[i].data);
              }
              client.query('INSERT INTO lots(user_id, brand, comment, time, price, gender, category, swap, country, city, size, condition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);', 
                        [req.cookies.user_id, req.body.brand, req.body.description, req.body.time, Number(req.body.startPriceSell), gender, req.body.category, true, req.body.country, req.body.city, req.body.bootsSize, req.body.state], 
                            function (err, result) {
                              //console.log(max);
                  for (i=0; i<req.files.basePhoto.length; i++){
                    if (i>0) main = false;
                     client.query('INSERT INTO images(lot_id, ismain) VALUES($1, $2);', [counter, main], function (err, result) {
                })
                 }
                 client.query('COMMIT', function (err, result) {
                   done()
                      res.redirect('/');
                })
            })
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
  /*if (begin[Number(req.params.id)] == true) {
    startTimer(req.params.id);
    begin[req.params.id] = false;
  }*/
  console.log(req.params.id);
  pool.connect(function (err, client, done) {
       client.query('select lots.lot_id, lots.comment, lots.time, lots.price, lots.gender, lots.model, images.img_id, brands.brand, cities.city, categories.category, globals.global, sizes.size, conditions.condition from lots, images, brands, cities, categories, globals, sizes, conditions where lots.lot_id = images.lot_id  and lots.lot_id = $1 and lots.brand_id = brands.brand_id and lots.city_id = cities.city_id and lots.category_id = categories.category_id and categories.global_id = globals.global_id and lots.size_id = sizes.size_id and lots.condition_id = conditions.condition_id;', [Number(req.params.id)], function (err, result) {
      done()
      //console.log(result.rows);
            if (req.cookies.name == undefined) {
              res.render('auction', {shmot : result.rows, info : '', money : ''});
            }
            else {
                res.render('auction', {shmot : result.rows, info : req.cookies.name, money : req.cookies.cash});
            }
       })
   })
});

/*function startTimer(option){
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
}*/


app.listen(3000);