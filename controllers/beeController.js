const debug = require('debug')('app:beeController');
const {red} = require('chalk');
const path = require('path');

function getTest(req, res) {
    debug('get test');
    res.render('test', {title: 'spelling test', heading: 'Spelling test'});
}

module.exports = { getTest }