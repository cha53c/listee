const debug = require('debug')('app:OEDService');
const axios = require('axios');

function getPronunciationAudioUrl(word) {
    debug('get entry');
    return new Promise((resolve, reject) => {
        axios.get( 'entries/en-gb/' + word, {
            baseURL: process.env.OED_BASE_URL,
            params: {},
            headers: {
                'app_id': process.env.OED_APP_ID,
                'app_key': process.env.OED_APP_KEY
            }
        })
            .then(function (response) {
                debug(response);
                let audioUrl = response.data.results[0].lexicalEntries[0].pronunciations[0].audioFile;
                debug('word %s, audioUrl %s', word, audioUrl);
                resolve( {word: word, audioUrl: audioUrl});
            })
            .catch(function (error) {
                console.log(error);
                reject(error);
            })
    });
}

module.exports = {getPronunciationAudioUrl};
