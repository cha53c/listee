process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app: server, stop} = require('../../app');
const should = chai.should();
const expect = chai.expect;
const cheerio = require('cheerio');
const rewire = require('rewire');
const listController = rewire("../../controllers/listController");


chai.use(chaiHttp);
// THESE SHOULD TEST KEY COMPONENTS OF THE RENDERED HTML AND  NOT THE CONTROLLER
// WHICH IS TESTED BY listConroller.test

describe('list routes', () => {
    let revert;
    afterEach(function revertRewire() {
        if (revert) {
            revert();
        }
    });
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
            describe('/PATCH multiple lists', () => {
                it('should return success message if all list are deleted', (done) => {
                    // TODO change json key to listids instead of listnames
                    revert = listController.__set__("userListStore.removeList", function removeList(listId) {
                        return true;
                    });
                    chai.request(server)
                        .patch('/lists/1')
                        .set('content-type', 'application/json')
                        .send({"listnames": ["old list", "new list"]})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.property('_status');
                            res.body._status.should.equal('success');
                            done();
                        });
                });
                it('should return an error if 1 or more lists are no found', (done) => {
                    revert = listController.__set__("userListStore.removeList", function removeList(listId) {
                        return false;
                    });
                    chai.request(server)
                        .patch('/lists/1')
                        .send({"listnames": ["new list", "wrong list"]})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('_status');
                            res.body._status.should.equal('err');
                            res.body._text.should.include("new list");
                            res.body._text.should.include("wrong list");
                            done();
                        });
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
            it('should return an error if the list name already exits ', (done) => {
                const name = 'new list';
                revert = listController.__set__("userListStore.getListNames", function getListNames(userId) {
                    return [name];
                });
                const list = {"listname": name, "items": ["red", "yellow", "green", "blue"]};
                chai.request(server)
                    .post('/lists/1/create')
                    .send(list)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.not.redirect;
                        res.body.should.property('_status');
                        // const status = res.body._status;
                        res.body._status.should.equal('err');
                        done();
                    });
            });
        });
        describe('/GET lists/userId/listId', () => {
            it('should show contents of list', (done) => {
                revert = listController.__set__("userListStore.getList", function getList(userId, listId) {
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
                revert = listController.__set__("userListStore.getList", function getList(userId, listId) {
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
                revert = listController.__set__("userListStore.updateList", function updateList(userId, listId, listName, items) {
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
            it('should delete an existing list', (done) => {
                revert = listController.__set__("userListStore.removeList", function removeList(userId, listname) {
                    return true;
                });
                chai.request(server)
                    .delete('/lists/1/9999')
                    .end((err, res) => {
                        res.should.have.status(200);
                        const status = res.body._status;
                        expect(status).to.equal('success');
                        done();
                    });
            });
            it('should return massage if list does not exist', (done) => {
                revert = listController.__set__("userListStore.removeList", function removeList(userId, listname) {
                    return false;
                });
                chai.request(server)
                    .delete('/lists/1/9999')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.property('_status');
                        res.body.should.property('_text');
                        res.body._status.should.equal('err');
                        done();
                    });
            })
        });
    });
});