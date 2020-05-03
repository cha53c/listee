const should = require('chai').should();
const chalk = require("chalk");
const chalkbox = require('../../utils/chalkbox');


describe('chalkbox', () => {

    describe('isDefCol method should', () => {
        it('should return yellow text if data is undefined', () => {
            const str = undefined;
            const ret = chalkbox.isDefCol(str);
            ret.should.equal('\u001b[33mundefined\u001b[39m');
        });
        it('should return green text if data is defined', () => {
            const str = "lettuce";
            const ret = chalkbox.isDefCol(str);
            ret.should.equal('\u001b[32mlettuce\u001b[39m');
        });
    });
});
