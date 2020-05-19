const debug = require('debug')('app:beeController');
const {red} = require('chalk');
const path = require('path');
const audioService = require('../services/OEDService');

function getTest(req, res) {
    const words = ['egg', 'butter', 'flour', 'sugar']
    // const words = ['flour'];
    debug('get test');
    (async function oed() {
        // TODO need to handle rejects currently hangs if word not found.
        const promises = words.map(word => audioService.getPronunciationAudioUrl(word));
        const mappedUrls = await Promise.all(promises);
        console.log(mappedUrls);
        res.render('test', {title: 'spelling test', heading: 'Spelling test', mappedUrls: mappedUrls});
    }());

}

function getAudio() {

}


module.exports = {getTest, getAudio}