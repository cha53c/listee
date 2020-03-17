const express = require('express');
const debug = require('debug')('app:authRoutes');

const router = express.Router();


router.post('/signUp', (req, res) => {
    debug('sign up user');
});

router.post('/signIn', (req, res, next) => {
    debug('log in user');
    res.redirect('/lists/1')
});

router.get('/', (req, res) => {
    debug('auth');
    res.render('signin');
});



module.exports = router;