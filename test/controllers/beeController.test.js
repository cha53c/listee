const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');
const beeController = require('../../controllers/beeController');

describe('beeController', function () {
    it('getTest should call render once', function (done) {
        const req = {};
        const res = {render: sinon.spy()};
        beeController.getTest(req, res);
        res.render.calledOnce.should.be.true;
        res.render.firstCall.args[0].should.equal('test');
        res.render.firstCall.args[1].should.have.keys(['title', 'heading']);
        done();
    });
});