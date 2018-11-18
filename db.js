const pg        = require('pg');
const express   = require('express');
const app       = express();

const config = {
    user: 'postgres',
    database: 'resalerDB',
    password: '178gz90Gruny19',
    port: 5432
};

// pool takes the object above -config- as parameter
const pool = new pg.Pool(config);

app.get('/', (req, res, next) => {
   pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query('SELECT * from users', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            console.log(result.rows);
            res.send(result.rows);
       })
   })
   //console.log(name)
});


var k = 20

app.get('/add', (req, res, next) => {
  var mass = [54, 'Stas', 'HZ', 'dasdasda']
   pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query('INSERT INTO users (user_id, name, login, link) VALUES ($1, $2, $3, $4);', mass, function (err, result) {
      done()
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            k += 1;
            res.redirect('/');
       })
   })
});

app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});