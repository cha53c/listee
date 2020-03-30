const express = require('express');
const debug = require('debug')('listRoutes')
const chalk = require('chalk');
const path = require('path');

const router = express.Router();

//users home list page
router.get('/:id', (req, res) => {
    const userId = req.params.userId;
    debug(`lists for user ${chalk.magenta(userId)}`);
    if(req.params.userId == 1) { //simulate logged in
        res.render('lists', {title: 'your lists', heading: 'Listee keeps all your lists are here'});
    } else {
        res.redirect('/'); // if not logged in redirect back to home page
    }
});

//send page to build new list
router.get('/create/:id/', (req, res) => {
    debug('create new list');
    const userId = req.params.userId;
    res.render('createList', {title: 'create new list', heading: 'Create your new list', userId: userId});
});

router.post('/create/:id/', (req, res) => {
    debug('post new list');
    const userId = req.params.userId;
    //save list to list store
    debug(req.body.listname);
    res.redirect(path.join('/lists', userId));
})

router.get('show/:id/:listId', (req, res) => {
    const listId = req.params.listId;
    debug(`show list: ${chalk.magenta(listId)}`);
    res.render('show', { listId: req.params.listId});
})

module.exports = router;

