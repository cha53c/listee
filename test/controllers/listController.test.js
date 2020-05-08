const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const listController = require('../../controllers/listController');
const { addList, getListNames} = require('../../model/list');
const List = require('../../model/list');

describe('listController', function () {
    describe('add list', function () {
        let req;
        let res;
        beforeEach(function setParams() {
            req = {params: {userId: '1'}, body: {}};
        });
        describe('get list page', function () {
            it('should render add', function () {
                const res = {render: sinon.spy()};
                listController.getAddListPage(req, res);
                res.render.calledOnce.should.be.true;
                res.render.firstCall.args[0].should.equal('add');
            })
        })
        describe('post new list', function () {
            let redirect, json;
            beforeEach(function setListname() {
                req.body.listname = 'shopping';
            });
            beforeEach(function setSpies() {
                res = {redirect: () => {}, json: () => {}};
                redirect = sinon.spy(res, 'redirect');
                json = sinon.spy(res, 'json');
            });
            afterEach(function () {
                res.redirect.restore();
                res.json.restore();
            });
            it('should redirect to user\'s lists page', function () {
                listController.addNewList(req, res);
                redirect.calledOnce.should.be.true;
            });
            it.skip('should not return error message', function () {
                listController.addNewList(req, res);
                json.calledOnce.should.be.false;
            });

            describe('if list name already exists', function () {
                it('should not redirect', function () {
                    listController.addNewList(req, res);
                    res.redirect.calledOnce.should.be.false;
                });
                it('should not add list');
                it('should return and error message');
            });
        });

    });

    describe('get show list page', function () {
        it('should render show', function () {
            const newList = addList('1', 'mylist', ['item 1', 'item 2', 'item 3']);
            const req = {params: {userId: '1', listId: newList.id}};
            const res = {render: sinon.spy()};
            listController.showList(req, res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('show');
            res.render.firstCall.args[1].should.have.keys(['title', 'userId', 'listId', 'listName', 'items']);
            res.render.firstCall.args[1].should.have.property('listName', 'mylist');
        });
    });
    describe('get user home page', function () {
        let req;
        beforeEach(function setParams() {
            req = {params: {userId: '1'}};
        });
        it('should render lists', function () {
            const res = {render: sinon.spy()};
            listController.getUserHome(req, res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('lists');
            res.render.firstCall.args[1].should.have.keys(['title', 'heading', 'lists', 'userId']);
            // res.render.firstCall.args[1].should.have.property('lists', []);
        })
        it('should render lists with 1 list', function () {
            const res = {render: sinon.spy()};
            const newList = addList('1', 'mylist', ['item 1', 'item 2', 'item 3']);
            listController.getUserHome(req, res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('lists');
            res.render.firstCall.args[1].should.have.keys(['title', 'heading', 'lists', 'userId']);
            // TODO how do you check the correct object is returned?
            // res.render.firstCall.args[1].should.have.property('items', 'your lists');
        })
    });
    describe('delete multiple lists', function () {
        it('should return and error if list does not exits');
    });
});