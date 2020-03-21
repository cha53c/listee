const express = require('express');
const debug = require('debug')('listRoutes')
const chalk = require('chalk');
const router = express.Router();

router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    debug(`lists for user ${chalk.magenta(userId)}`);
    if(req.params.userId == 1) { //simulate logged in
        res.render('lists', {title: 'your lists', heading: 'Listee keeps all your lists are here'});
    } else {
        res.redirect('/'); // if not logged in redirect back to home page
    }
});

router.get('/create/:userId/', (req, res) => {
    debug('create');
    res.render('createList', {title: 'create new list', heading: 'Create your new list'});
});

router.get('show/:userId/:listId', (req, res) => {
    const listId = req.params.listId;
    debug(`show list: ${chalk.magenta(listId)}`);
    res.render('show', { listId: req.params.listId});
})

module.exports = router;

