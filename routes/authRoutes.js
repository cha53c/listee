const express = require('express');
const debug = require('debug')('app:authRoutes');
const chalk = require('chalk');

const userStore = require('../model/userStore')

const router = express.Router();
router.get('/signUp', (req, res) => {
    debug('sign up route');
    res.render('sighup');
});

router.post('/signUp', (req, res) => {
    debug('sign up user');
    userStore.addUser(req.body.username);
    debug(req.body);
    res.render('auth');
    // res.json(req.body);
});

router.get('/', (req, res) => {
    debug('auth');
    res.render('auth');
});

router.get('/login', (req, res) => {
    debug('login route');
    res.render('login', {title: "login"});
});

router.post('/login', (req, res, next) => {
    let user = req.body.username;
    debug(`attempting to log in user ${user}`);
    debug(req.body);
    if (userStore.isUser(user)) {
        // if(true) {
        debug('redirecting to list/1')
        res.redirect('/lists/1')
    } else {
        debug('user not found')
        res.redirect('/');
    }
});

module.exports = router;