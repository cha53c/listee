const express = require('express');
const debug = require('debug')('app:authRoutes');
const chalk = require('chalk');

const userStore = require('../model/userStore')

const router = express.Router();

    router.post('/signUp', (req, res) => {
        debug('sign up user');
        userStore.addUser(req.body.username);
        debug(req.body);
        // res.render('auth');
        res.json(req.body);
    });

    router.get('/', (req, res) => {
        debug('auth');
        res.render('auth');
    });

    router.post('/login', (req, res, next) => {
        let user = req.body.username;
        debug(`attempting to log in user ${user}`);
        debug(req.body);
        if(userStore.isUser(user)) {
            debug('redirecting to list')
            res.redirect('/lists/1')
        }
        debug('user not found')
    });

module.exports = router;