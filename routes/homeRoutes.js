const express = require('express');
const debug = require('debug')('app:homeRoutes');
const router = express.Router();

router.get('/', (req, res) => {
    debug('home');
    res.render('home', {title: 'Listee home page'});
});

module.exports = router;

