const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');

const listController = rewire("../../controllers/listController");
const {SUCCESS_STATUS, ERROR_STATUS} = require('../../controllers/listController');
const List = require('../../model/userListStore');
const {addList} = require('../../model/userListStore');
const {emptyStore, createListStoreForUser} = require('../../model/listStore');

// TODO find out how to check redirect url
describe('listController', function () {
    const USER1_ID = '1';
    let req;
    let res;
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
    afterEach(function removeSpies() {
        // TODO fix errors on restore
        // res.render.restore();
        // res.redirect.restore();
        // res.json.restore();
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
                    const listsBefore = List.getAllLists(USER1_ID);
                    listController.addNewList(req, res);
                    const listsAfter = List.getAllLists(USER1_ID);
                    listsBefore.should.deep.equal(listsAfter);
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
            const newList = addList(USER1_ID, 'mylist', ['item 1', 'item 2', 'item 3']);
            const req = {params: {userId: USER1_ID, listId: newList.id}};
            listController.showList(req, res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('show');
            res.render.firstCall.args[1].should.have.keys(['title', 'userId', 'listId', 'listName', 'items']);
            res.render.firstCall.args[1].should.have.property('listName', 'mylist');
            res.render.firstCall.args[1].should.have.deep.property('items', ['item 1', 'item 2', 'item 3']);
            done();
        });

        it('should render with list items as an empty array if list is not found', function (done) {
            // TODO is this cleaner than using the userListStore methods directly
            const userListStore = listController.__get__('userListStore');
            const getListStubReturnsUndefined = sinon.stub(userListStore, 'getList').returns(undefined);
            listController.__set__('userListStore', userListStore);
            listController.showList(req, res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('error');
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

    describe('delete list', function () {
        it('should call res.json only once', function (done) {
            listController.deleteList(req, res);
            res.json.calledOnce.should.be.true;
            done();
        });
        it('should return a success message', function (done) {
            const newList = addList(USER1_ID, 'mylist', ['item 1', 'item 2', 'item 3']);
            req.params.listId = newList.id;
            listController.deleteList(req, res);
            res.json.calledOnce.should.be.true;
            res.json.firstCall.args[0].should.have.property('status', SUCCESS_STATUS);
            res.json.firstCall.args[0].should.have.property('text').which.contains(newList.id);
            done();
        });
        it('should return error message if not list exists', function (done) {
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
        it('should call res.json once with error if list does not exits', function () {
            const list1 = addList(USER1_ID, 'mylist', ['item 1', 'item 2', 'item 3']);
            req.body.listnames = ['nosuchid'];
            listController.deleteMultipleLists(req, res);
            res.json.calledOnce.should.be.true;
            res.json.firstCall.args[0].should.have.property('status', ERROR_STATUS);
        });
        it('should return success if list is deleted', function (done) {
            const list1 = addList(USER1_ID, 'mylist', ['item 1', 'item 2', 'item 3']);
            const list2 = addList(USER1_ID, 'list2', ['item 1', 'item 2', 'item 3']);
            req.body.listnames = [list1.id, list2.id];
            listController.deleteMultipleLists(req, res);
            res.json.calledOnce.should.be.true;
            res.json.firstCall.args[0].should.have.property('status', 'success');
            res.json.firstCall.args[0].should.have.property("text").which.contains(list1.id);
            done();
        });
    });
});