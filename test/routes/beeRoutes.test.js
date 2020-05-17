process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app: server, stop} = require('../../app');
const should = chai.should();
const expect = chai.expect;
const cheerio = require('cheerio');
chai.use(chaiHttp);

// NOTE: These tests are used to test the RENDERED pages
describe('/GET test', function () {
    it('should get the test page', function () {
        chai.request(server)
            .get('/bee/test')
            .end((err, res) => {
                res.should.have.status(200);
                const $ = cheerio.load(res.text);
                $('title').text().should.equal('spelling test');
                $('h1').text().should.equal('Spelling test');
                $('button#start-test').text().should.equal('Start');
            });
    });
});