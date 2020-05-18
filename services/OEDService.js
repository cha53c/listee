const debug = require('debug')('app:OEDService');
const axios = require('axios');

function getPronunciation() {
    debug('get entry');
    const endPoint = 'entries';
    const sourceLan = 'en-gb';
    const word = 'badger';
    axios.get( 'entries/en-gb/badger', {
        baseURL: process.env.OED_BASE_URL,
        params: {},
        headers: {
            'app_id': process.env.OED_APP_ID,
            'app_key': process.env.OED_APP_KEY
        }
    })
        .then(function (response) {
            debug(response);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
    // TODO return audio from OED
    return 'audio goes here';
}

module.exports = {getPronunciation};