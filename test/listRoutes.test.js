process.env.NODE_ENV = 'test';


//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server, stop } = require('../app');
const should = chai.should();
const cheerio = require('cheerio');

chai.use(chaiHttp);

//Our parent block
describe('lists', () => {
    after(()=> {
        stop();
    });
    describe('/GET book', () => {
        it('it should GET all the lists page', (done) => {
            chai.request(server)
                .get('/lists/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    // const $ = cheerio.load(res.body);
                    // console.log($('h1').text());
                    // res.body.should.be.a('array');
                    // res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

});