const express = require('express');
const debug = require('debug')('app:listRoutes');
const chalk = require('chalk');
const path = require('path');

const {getAllLists, addList, getList} = require('../model/list');

const router = express.Router();

let userId, listId;

//users lists home page
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    debug(`user ${chalk.magenta(userId)} attempting to access their list page`);
    if (req.params.userId == 1) { //simulate logged in
        debug(`access ok for user ${chalk.magenta(userId)}`);
        const lists = getAllLists(userId);
        const listCount = lists == undefined ? 0 : lists.size;
        const listnames = lists == undefined ? "" : lists.keys(); // pass empty iterable if undefined
        debug('list name: ' + listnames);
        res.render('lists', {
            title: 'your lists', heading: 'Listee keeps all your lists here',
            listCount: listCount, listnames: listnames
        });
    } else {
        debug('user access not authorised');
        res.redirect('/'); // if not logged in redirect back to home page
    }
});

//new list page
router.get('/:userId/create/', (req, res) => {
    debug('create new list');
    const userId = req.params.userId;
    res.render('createList', {title: 'create new list', heading: 'Create your new list', userId: userId});
});

// creat new list page
router.post('/:userId/create/', (req, res) => {
    debug('post new list');
    debug(req.body);
    const userId = req.params.userId;
    const listName = req.body.listname;
    const items = req.body.items;
    addList(userId, listName, items);
    debug(req.body.listname);
    res.redirect(path.join('/lists', userId));
})

// show list
router.get('/:userId/show/:listId/', (req, res) => {
    const userId = req.params.userId;
    const listId = req.params.listId;
    debug(`show list: ${chalk.magenta(listId)}`);
    const list = getList(userId, listId);
    const items = list == undefined ? "" : list.items;
    debug('items: ' + items);
    res.render('show', {listId: listId, items: items});
})

// edit list
router.get('/:userId/edit/:listId', (req, res) => {
    unpackParams(req);
    debug(`edit list: ${chalk.magenta(listId)}`);
    // TODO DRY this up - same as show
    const list = getList(userId, listId);
    const items = list == undefined ? "" : list.items;
    debug('items: ' + items);
    res.render('edit', {listId: listId, items: items});
})


function unpackParams(req) {
    userId = req.params.userId;
    listId = req.params.listId;
    debug(`userId: ${userId} listId: ${listId}`);
}


module.exports = router;

