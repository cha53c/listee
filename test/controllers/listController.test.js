const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');

const listController = rewire("../../controllers/listController");
const {SUCCESS_STATUS, ERROR_STATUS} = require('../../controllers/listController');
const List = require('../../model/userListStore');
const {addList} = require('../../model/userListStore');
const {emptyStore, createListStoreForUser} = require('../../model/listStore');

// TODO check parameters passed to redirect
describe('listController', function () {
    const USER1_ID = '1';
    const list = {id: 'listId1', name: 'mylist', items: ['item 1', 'item 2', 'item 3']};
    let req;
    let res;
    let userListStoreRewire;

    beforeEach(function setRewire() {
        userListStoreRewire = listController.__get__('userListStore');
    });
    beforeEach(function createListStore() {
        createListStoreForUser(USER1_ID);
    });
    beforeEach(function setParams() {
        req = {params: {userId: USER1_ID}, body: {}};
    });
    beforeEach(function setSpies() {
        res = {render: sinon.spy(), redirect: sinon.spy(), json: sinon.spy()}
    });
    afterEach(function emptyListStore() {
        emptyStore();
    });

    describe('get user home page', function () {
        it('should render lists', function (done) {
            const res = {render: sinon.spy()};
            listController.getUserHome(req, res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('lists');
            res.render.firstCall.args[1].should.have.keys(['title', 'heading', 'lists', 'userId']);
            done();
        })
        it('should render lists with 1 list', function (done) {
            const res = {render: sinon.spy()};
            const newList = addList(USER1_ID, 'mylist', ['item 1', 'item 2', 'item 3']);
            listController.getUserHome(req, res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('lists');
            res.render.firstCall.args[1].should.have.keys(['title', 'heading', 'lists', 'userId']);
            // TODO how do you check the correct object is returned?
            done();
        })
    });

    describe('add list', function () {
        let stub, revertRewire;
        afterEach(function () {
            if (stub) {
                stub.restore();
            }
            if (revertRewire) {
                revertRewire();
            }
        });
        describe('get list page', function () {
            it('should render add', function (done) {
                listController.getAddListPage(req, res);
                res.render.calledOnce.should.be.true;
                res.render.firstCall.args[0].should.equal('add');
                done();
            })
        })
        describe('post new list', function () {
            beforeEach(function setListname() {
                req.body.listname = 'shopping';
            });
            it('should redirect to user\'s lists page', function (done) {
                listController.addNewList(req, res);
                res.redirect.calledOnce.should.be.true;
                done();
            });
            it('should not return error message', function (done) {
                listController.addNewList(req, res);
                res.json.calledOnce.should.be.false;
                done();
            });

            describe('if list name already exists', function () {
                beforeEach(function createList() {
                    // TODO replace with stubs and spies
                    const newList = addList(USER1_ID, 'mylist', ['item 1', 'item 2', 'item 3']);
                    req.body.listname = 'mylist';
                });
                it('should not redirect', function (done) {
                    listController.addNewList(req, res);
                    res.redirect.calledOnce.should.be.false;
                    res.json.calledOnce.should.be.true;
                    done();
                });
                it('should not add list', function () {
                    let addList = sinon.spy(userListStoreRewire, 'addList');
                    const revertRewire = listController.__set__('userListStore', userListStoreRewire);
                    listController.addNewList(req, res);
                    addList.called.should.be.false;
                    addList.restore();
                    revertRewire();
                });
                it('should call res.json and return error message', function (done) {
                    listController.addNewList(req, res);
                    res.json.calledOnce.should.be.true;
                    res.json.firstCall.args[0].should.have.property('status', ERROR_STATUS);
                    res.redirect.calledOnce.should.be.false;
                    done();
                });
            });
        });
    });

    describe('get show list page', function () {
        it('should render show', function (done) {
            let stub = sinon.stub(userListStoreRewire, 'getList').returns(list);
            const revertRewire = listController.__set__('userListStore', userListStoreRewire);
            const req = {params: {userId: USER1_ID, listId: list.id}};
            listController.showList(req, res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('show');
            res.render.firstCall.args[1].should.have.keys(['title', 'userId', 'listId', 'listName', 'items']);
            res.render.firstCall.args[1].should.have.property('listName', 'mylist');
            res.render.firstCall.args[1].should.have.deep.property('items', ['item 1', 'item 2', 'item 3']);
            stub.restore();
            revertRewire();
            done();
        });

        it('should render with list items as an empty array if list is not found', function (done) {
            let stub = sinon.stub(userListStoreRewire, 'getList').returns(undefined);
            const revertRewire = listController.__set__('userListStore', userListStoreRewire);
            listController.showList(req, res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('error');
            stub.restore();
            revertRewire();
            done();
        });
    });
    describe('update a list', function () {
        it('should update the list and return a success message', function () {
            const newList = addList(USER1_ID, 'mylist', ['item 1', 'item 2', 'item 3']);
            req.params.listId = newList.id;
            req.body.listname = newList.name;
            req.body.items = ['item 1', 'item 2']
            listController.patchList(req, res);
            res.json.calledOnce.should.be.true;
            res.json.firstCall.args[0].should.have.property('status', SUCCESS_STATUS);
        });
    });
    describe('delete', function () {
        let revertRewire, stub;
        beforeEach(function () {

        });
        afterEach(function () {
            if (stub) {
                stub.restore();
            }
            if (revertRewire) {
                revertRewire();
            }
        });
        describe('delete list', function () {
            it('should call res.json only once', function (done) {
                listController.deleteList(req, res);
                res.json.calledOnce.should.be.true;
                done();
            });
            it('should return a success message', function (done) {
                stub = sinon.stub(userListStoreRewire, 'removeList').returns(true);
                revertRewire = listController.__set__('userListStore', userListStoreRewire);
                req.params.listId = 'listId1';
                listController.deleteList(req, res);
                res.json.calledOnce.should.be.true;
                res.json.firstCall.args[0].should.have.property('status', SUCCESS_STATUS);
                res.json.firstCall.args[0].should.have.property('text').which.contains('listId1');
                done();
            });
            it('should return error message if no list exists', function (done) {
                listController.deleteList(req, res);
                res.json.calledOnce.should.be.true;
                res.json.firstCall.args[0].should.have.property('status', ERROR_STATUS);
                done();
            });

        });
        describe('delete multiple lists', function () {
            it('should call res.json only once', function (done) {
                req.body.listnames = []; // TODO ??
                listController.deleteMultipleLists(req, res);
                res.json.calledOnce.should.be.true;
                done();
            });
            it('should call res.json once with error if list does not exits', function (done) {
                stub = sinon.stub(userListStoreRewire, 'removeList').returns(false);
                revertRewire = listController.__set__('userListStore', userListStoreRewire);
                req.body.listnames = ['nosuchid'];
                listController.deleteMultipleLists(req, res);
                res.json.calledOnce.should.be.true;
                res.json.firstCall.args[0].should.have.property('status', ERROR_STATUS);
                res.json.firstCall.args[0].should.have.property("text").which.contains('nosuchid');
                done();
            });
            it('should call res.json with success if lists are deleted', function (done) {
                stub = sinon.stub(userListStoreRewire, 'removeList').returns(true);
                revertRewire = listController.__set__('userListStore', userListStoreRewire);
                req.body.listnames = ['id1', 'id2'];
                listController.deleteMultipleLists(req, res);
                res.json.calledOnce.should.be.true;
                res.json.firstCall.args[0].should.have.property('status', 'success');
                res.json.firstCall.args[0].should.have.property("text").which.contains('id1');
                res.json.firstCall.args[0].should.have.property("text").which.contains('id2');
                done();
            });
        });
    });
});
