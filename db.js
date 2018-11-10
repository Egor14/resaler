const pg        = require('pg');
const express   = require('express');
const app       = express();

const config = {
    user: 'postgres',
    database: 'test',
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
       client.query('SELECT * FROM students', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.send(result.rows);
       })
   })
});

var k = 0

app.get('/:id', (req, res, next) => {
   pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query('INSERT INTO students (s_id, name, start_year) VALUES ($1, $2, $3);', [k, req.params.id, 2017], function (err, result) {
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