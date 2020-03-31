const express = require('express');
const debug = require('debug')('app:listRoutes');
const chalk = require('chalk');
const path = require('path');

const {getAllLists, addList } = require('../model/list');

const router = express.Router();

//users home list page
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    debug(`user ${chalk.magenta(userId)} attempting to access their list page`);
    if(req.params.userId == 1) { //simulate logged in
        debug(`access ok for user ${chalk.magenta(userId)}`);
        // TODO get users lists
        const lists = getAllLists(userId);
        const listCount = lists == undefined ? 0 : lists.size;
        // TODO just pass list names
        const listnames = lists &&   lists.keys();
        debug('list name: ' + listnames);
        res.render('lists', {title: 'your lists', heading: 'Listee keeps all your lists here',
            listCount: listCount, lists: listnames});
    }
    else {
        debug('user access not authorised');
        res.redirect('/'); // if not logged in redirect back to home page
    }
});

//send page to build new list
router.get('/:userId/create/', (req, res) => {
    debug('create new list');
    const userId = req.params.userId;
    res.render('createList', {title: 'create new list', heading: 'Create your new list', userId: userId});
});

router.post('/:userId/create/', (req, res) => {
    debug('post new list');
    const userId = req.params.userId;
    // TODO save list to list store
    addList(userId, req.body.listname);
    debug(req.body.listname);
    res.render('show', {listId: '1'}); //TODO will eventually go back to main lists page
    // res.redirect(path.join('/lists', userId));
})

router.get('/:userId/show/:listId/', (req, res) => {
    const listId = req.params.listId;
    debug(`show list: ${chalk.magenta(listId)}`);
    // TODO render list from list store
    res.render('show', { listId: req.params.listId});
})

module.exports = router;

