const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const listController = require('../../controllers/listController');

describe('listController', function () {
    describe('get add list page', function () {
        let req;
        beforeEach(function setParams() {
            req = {params: {userId: '1'}};
        });
        it('should render add', function () {
            const res = {render: sinon.spy()};
            listController.getAddListPage(req, res);
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('add');
        })
    });
});