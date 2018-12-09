var index = require('../serv');

var should = require('should'),
    supertest = require('supertest')

describe('Тесты', function(){

    it('Проверка подключения к БД', function(done){
        supertest('https://resaler.herokuapp.com')
            .get('/isDbConnected')
            .expect(200)
            .end(function(err, res){
                res.status.should.equal(200);
                done();
            });

    });

    it('Открытие главной страницы', function(done){
        supertest('https://resaler.herokuapp.com')
            .get('/')
            .expect(200)
            .end(function(err, res){
                res.status.should.equal(200);
                done();
            });

    });

    it('Открытие страницы входа', function(done){
        supertest('https://resaler.herokuapp.com')
            .get('/log')
            .expect(200)
            .end(function(err, res){
                res.status.should.equal(200);
                done();
            });

    });

    it('Открытие первого лота', function(done){
        supertest('https://resaler.herokuapp.com')
            .get('/auction/12/')
            .expect(200)
            .end(function(err, res){
                res.status.should.equal(200);
                done();
            });

    });

    it('Вход в систему c верным логином и паролем', function(done){
        supertest('https://resaler.herokuapp.com')
            .post('/login')
            .type('form')
            .field('email', 'egor@mail.ru')
            .field('password', 'qazzaq')
            .redirects(1)
            .expect(200)
            .end(function(err, res){
                res.status.should.equal(200);
                done();
            });

    });

    it('Вход в систему с неверным логином', function(done){
        supertest('https://resaler.herokuapp.com')
            .post('/login')
            .type('form')
            .field('email', 'egor@mail')
            .field('password', 'qazzaq')
            .expect(200)
            .end(function(err, res){
                res.status.should.equal(200);
                done();
            });

    });

    it('Вход в систему с неверным паролем', function(done){
        supertest('https://resaler.herokuapp.com')
            .post('/login')
            .type('form')
            .field('email', 'egor@mail.ru')
            .field('password', 'qazza')
            .expect(200)
            .end(function(err, res){
                res.status.should.equal(200);
                done();
            });

    });

    it('Регистрация пользователя с неверными данными', function(done){
        supertest('https://resaler.herokuapp.com')
            .post('/signin')
            .type('form')
            .field('name', 'adasd')
            .field('link', 'qazza')
            .field('email', 'egor@mail.ru')
            .field('password', 'qazza')
            .expect(200)
            .end(function(err, res){
                res.status.should.equal(200);
                done();
            });

    });

});