const debug = require('debug')('app:beeController');
const { red } = require('chalk');
const path = require('path');
const audioService = require('../services/OEDService');

function getTest(req, res) {
    debug('get test');
    res.render('test', {title: 'spelling test', heading: 'Spelling test'});
}

function getAudio(req, res){
    debug('get audio');
    res.json(audioService.getPronunciation());
}

module.exports = { getTest, getAudio }