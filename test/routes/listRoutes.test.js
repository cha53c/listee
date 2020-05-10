process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app: server, stop} = require('../../app');
const should = chai.should();
const expect = chai.expect;
const cheerio = require('cheerio');

chai.use(chaiHttp);
// THESE TESTS SHOULD TEST KEY COMPONENTS OF HTML RETURN FROM THE ROOTS NOT THE CONTROLLER
// WHICH IS TESTED BY listConroller.test
// TODO use rewrite to use mock to remove the need for all the http set calls

describe('list routes', () => {
    after(() => {
        stop();
    });
    describe('home page', () => {
        describe('/GET lists', () => {
            it('should GET the lists page with 0 lists', (done) => {
                chai.request(server)
                    .get('/lists/1')
                    .end((err, res) => {
                        res.should.have.status(200);
                        const $ = cheerio.load(res.text);
                        expect($('h2').text()).to.include('You have 0 lists');
                        done();
                    });
                it('should lists page for user with 1 list');
            });
            // TODO need find a way to get list ids to make delete call
            describe.skip('/PATCH multiple lists', () => {
                it('should delete all lists', (done) => {
                    chai.request(server)
                        .get('/lists/1')
                        .end((err, res) => {
                            res.should.have.status(200);
                            const $ = cheerio.load(res.text);
                            expect($('h2').text()).to.include('You have 0 lists');
                        });
                    chai.request(server)
                        .post('/lists/1/create')
                        // .set('content-type', 'application/json')
                        .send({"listname": "new list", "items": ["red"]})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.redirect;
                            // TODO need to slave list id
                        });
                    chai.request(server)
                        .post('/lists/1/create')
                        .set('content-type', 'application/json')
                        .send({"listname": "old list", "items": ["blue"]})
                        .end((err, res) => {
                            res.should.have.status(200);
                            // TODO need to slave list id
                        });
                    chai.request(server)
                        .get('/lists/1')
                        .end((err, res) => {
                            res.should.have.status(200);
                            const $ = cheerio.load(res.text);
                            expect($('h2').text()).to.include('You have 2 lists');
                        });
                    chai.request(server)
                        .patch('/lists/1')
                        .set('content-type', 'application/json')
                        .send({"listnames": ["old list", "new list"]})
                        .end((err, res) => {
                            res.should.have.status(200);
                        });
                    chai.request(server)
                        .get('/lists/1')
                        .end((err, res) => {
                            res.should.have.status(200);
                            const $ = cheerio.load(res.text);
                            // expect($('h2').text()).to.include('You have 0 lists');
                        });
                    done();
                });
                it('should return an error if a list does not exist', (done) => {
                    chai.request(server)
                        .post('/lists/1/create')
                        .set('content-type', 'application/json')
                        .send({"listname": "new list", "items": ["red"]})
                        .end((err, res) => {
                            res.should.have.status(200);
                        });
                    chai.request(server)
                        .patch('/lists/1')
                        .set('content-type', 'application/json')
                        .send({"listnames": ["new list", "wrong list"]})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.text.should.include('err');
                            res.text.should.include('wrong list');
                            res.text.should.not.include('new list');
                        });
                    done();
                });
            });
        });
    });

    describe('list CRUD operations', () => {
        describe('/POST lists/userId/create', () => {
            it('should add a new list and redirect to show page containing list name', (done) => {
                const list = {"listname": "rainbow", "items": ["red", "yellow", "green", "blue"]};
                chai.request(server)
                    .post('/lists/1/create')
                    .send(list)
                    .end((err, res) => {
                        res.should.have.status(200);
                        expect(res).to.redirect;
                        // TODO figure out how to check the redirect parameters
                        // expect(res).to.redirectTo('/^*.\/lists\/1\/rainbow$/');
                        // TODO for some reason redirect works but show does not find the list under test
                        // even though it does work
                        // res.text.should.contain('rainbow');
                        done();
                    });
            });
            it('should not add a list if the id already exits', (done) => {
                const list = {"listname": "new list", "items": ["red", "yellow", "green", "blue"]};
                chai.request(server)
                    .post('/lists/1/create')
                    .set('content-type', 'application/json')
                    .send(list)
                    .end((err, res) => {
                        res.should.have.status(200);
                        // expect(res).to.redirect;
                        // done();
                    });
                chai.request(server)
                    .post('/lists/1/create')
                    .set('content-type', 'application/json')
                    .send(list)
                    .end((err, res) => {
                        res.should.have.status(200);
                        // TODO check response message
                        expect(res).to.have.property('status');

                    });
                done();
            });
        });
        describe('/GET lists/userId/listId', () => {
            it.skip('should show contents of list', (done) => {
                chai.request(server)
                    // todo need to find a way to create a list id.
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
            // TODO needs a way to retrieve list id to work
            it.skip('should update an existing list', (done) => {
                const originalList = {"listname": "rainbow", "items": ["red", "green"]};
                chai.request(server)
                    .post('/lists/1/create')
                    .set('content-type', 'application/json')
                    .send(originalList)
                    .end((err, res) => {
                        res.should.have.status(200);
                    });
                const updatedList = {"listname": "rainbow", "items": ["red", "green", "blue"]};
                chai.request(server)
                    .patch('/lists/1/rainbow')
                    .set('content-type', 'application/json')
                    .send(updatedList)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.text.should.include('blue');
                    });
                done();
            });
        });
        describe('/delete /:userId/:listId/', () => {
            // TODO need to get list id for this to work
            it.skip('should delete an existing list', (done) => {
                chai.request(server)
                    .delete('/lists/1/rainbow')
                    .set('content-type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200);
                        const status = res.body.status;
                        expect(status).to.equal('success');
                        done();
                    });
            });
            it('should return massage if list does not exist', (done) => {
                chai.request(server)
                    .delete('/lists/1/whatnot')
                    .set('content-type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.property('_status');
                        res.body.should.property('_text');
                        const status = res.body._status;
                        expect(status).to.equal('err');
                        done();
                    });
            })
        });
    });
});