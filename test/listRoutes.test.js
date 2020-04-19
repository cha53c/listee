process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app: server, stop} = require('../app');
const should = chai.should();
const expect = chai.expect;
const cheerio = require('cheerio');

chai.use(chaiHttp);

//Our parent block
describe('lists', () => {
    // beforeEach( () => {
    //     const { app: server, stop } = require('../app')
    // });
    after(() => {
        stop();
    });
    describe('home page', () => {
        describe('/GET lists', () => {
            it('it should GET the lists page with 0 lists', (done) => {
                chai.request(server)
                    .get('/lists/1')
                    .end((err, res) => {
                        res.should.have.status(200);
                        const $ = cheerio.load(res.text);
                        expect($('h2').text()).to.eql('You have 0 lists ');
                        done();
                    });
            });
        });
    });

    describe('list CRUD operations', () => {
        // beforeEach( () => {
        //     const { app: server, stop } = require('../app')
        // });
        describe('/POST lists/userId/create', () => {
            it('it should add a new list and redirect to lists page', (done) => {
                const list = {"listname": "rainbow", "items": ["red", "yellow", "green", "blue"]};
                chai.request(server)
                    .post('/lists/1/create')
                    .set('content-type', 'application/json')
                    .send(list)
                    .end((err, res) => {
                        res.should.have.status(200);
                        expect(res).to.redirect;
                        // TODO figure out how to use rex in redirect
                        // expect(res).to.redirectTo('/^*.\/lists\/1\/rainbow$/');
                        const $ = cheerio.load(res.text);
                        expect($('h1').text()).to.include('rainbow');
                        done();
                    });
            });
        });
        describe('/GET lists/userId/listId', () => {
            it('it should show contents of list', (done) => {
                chai.request(server)
                    .get('/lists/1/rainbow')
                    .end((err, res) => {
                        res.should.have.status(200);
                        const $ = cheerio.load(res.text);
                        expect($('.list-item').first().text()).to.eql('red');
                        done();
                    });
            });
        });
        describe('/PATCH lists/userId/listId', () => {
            it('it should update an existing list', (done) => {
                const list = {"listname": "rainbow", "items": ["red", "yellow", "green", "blue", "orange"]};
                chai.request(server)
                    .patch('/lists/1/rainbow')
                    .set('content-type', 'application/json')
                    .send(list)
                    .end((err, res) => {
                        res.should.have.status(200);
                        const $ = cheerio.load(res.text);
                        expect($('.list-item').first().text()).to.equal('red');
                        done();
                    });
            });
        });
        describe('/delete /:userId/:listId/', () => {
            it('it should delete an existing list', (done) => {
                chai.request(server)
                    .delete('/lists/1/rainbow')
                    .set('content-type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200);
                        const status = res.body.status;
                        console.log(res.body);
                        expect(status).to.equal('success');
                        done();
                    });
            });
            it('it should return massage if list does not exist', (done) =>{
                chai.request(server)
                    .delete('/lists/1/whatnot')
                    .set('content-type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200);
                        console.log(res.body);
                        res.body.should.property('status')
                        res.body.should.property('msg');
                        const status = res.body.status;
                        expect(status).to.equal('err');
                        done();
                    });
            })
        });
    });

});