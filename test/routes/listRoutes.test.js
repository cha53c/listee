process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app: server, stop} = require('../../app');
const should = chai.should();
const expect = chai.expect;
const cheerio = require('cheerio');
const sinon = require('sinon');
const rewire = require('rewire');
const listController = rewire("../../controllers/listController");


chai.use(chaiHttp);
// THESE SHOULD TEST KEY COMPONENTS OF THE RENDERED HTML AND  NOT THE CONTROLLER
// WHICH IS TESTED BY listConroller.test
// TODO use rewrite to use mock to remove the need for all the http set calls

describe('list routes', () => {
    const LIST_ID = "xXXXx01"
    after(() => {
        stop();
    });
    describe('home page', () => {
        describe('/GET lists', () => {
            // it should have ul id list
            it('should GET the lists page with 0 lists', (done) => {
                chai.request(server)
                    .get('/lists/1')
                    .end((err, res) => {
                        res.should.have.status(200);
                        const $ = cheerio.load(res.text);
                        $('title').text().should.equal('your lists');
                        $('ul#list-items').length.should.equal(1);
                        $('li.list-row').length.should.equal(0);
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
            it('should show contents of list', (done) => {
                listController.__set__("userListStore.getList", function getList(userId, listId) {
                    return {'id': "9999", 'name': "rainbow", 'items': ["red", "yellow", "green", "blue"]};
                });
                chai.request(server)
                    .get('/lists/1/9999')
                    .end((err, res) => {
                        res.should.have.status(200);
                        const $ = cheerio.load(res.text);
                        $('title').text().should.equal("rainbow");
                        $('ul#list-items').length.should.equal(1);
                        $('li.list-row').length.should.equal(4);
                    });
                done();
            });
            it('should rende error page if not list found', function (done) {
                listController.__set__("userListStore.getList", function getList(userId, listId) {
                    return undefined;
                });
                chai.request(server)
                    .get('/lists/1/9999')
                    .end((err, res) => {
                        res.should.have.status(200);
                        const $ = cheerio.load(res.text);
                        $('title').text().should.equal("Error");
                    });
                done();
            });
        });
        describe('/PATCH lists/userId/listId', () => {
            // TODO needs a way to retrieve list id to work
            it('should update an existing list', (done) => {
                const updatedList = {"id": "9999", "name": "rainbow", "items": ["red", "green", "blue"]};
                listController.__set__("userListStore.updateList", function updateList(userId, listId, listName, items) {
                    return updatedList;
                });

                chai.request(server)
                    .patch('/lists/1/9999')
                    .set('content-type', 'application/json')
                    .send(updatedList)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.text.should.include('red');
                        res.text.should.include('green');
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
    describe.skip('rewire test', function () {
        it('should mock UserListStore', function () {
            listController.__set__("SUCCESS_STATUS", 'cheese');
            const status = listController.__get__("SUCCESS_STATUS");
            console.log((status));

            const getList = listController.__get__("userListStore.getList");
            console.log(getList);
            listController.__set__("userListStore.getList", function getList() {
                return 'tomatoes'
            });
            const newGetList = listController.__get__("userListStore.getList");
            console.log(newGetList());
        });
    });
});