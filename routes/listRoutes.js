const express = require('express');
const debug = require('debug')('app:listRoutes');
const chalk = require('chalk');
const path = require('path');

const {getAllLists, getListNames, addList, getList, updateList, removeList} = require('../model/list');
const { isDefCol } = require('../utils/chalkbox');

const router = express.Router();

let userId, listId, listName, list, items;

//users lists home page
router.get('/:userId', (req, res) => {
    unpackParams(req);
    debug(`user ${isDefCol(userId)} attempting to access their list page`);
    if (req.params.userId == 1) { //simulate logged in
        debug(`access ok for user ${isDefCol(userId)}`);
        // const lists = getAllLists(userId);
        // const listCount = lists == undefined ? 0 : lists.size;
        // const listnames = lists == undefined ? "" : lists.keys(); // pass empty iterable if undefined
        const listnames = getListNames(userId);
        const listCount = listnames.length;
        debug('list name: ' + listnames);
        res.render('lists', {
            title: 'your lists', heading: 'Listee keeps all your lists here',
            listCount: listCount, listnames: listnames, userId: userId
        });
    } else {
        debug('user access not authorised');
        res.redirect('/'); // if not logged in redirect back to home page
    }
});

//new list page
router.get('/:userId/create/', (req, res) => {
    debug('create new list');
    unpackParams(req);
    const listnames = getListNames(userId);
    res.render('add', {title: 'create new list', heading: 'Create your new list', userId: userId, listnames: listnames});
});

// creat new list page
router.post('/:userId/create/', (req, res) => {
    debug('post new list');
    debug(req.body);
    unpackParams(req);
    unpackBody(req);
    addList(userId, listName, items);
    debug(listName);
    res.redirect(path.join('/lists', userId));
})

// TODO remove actions params from url and use http methods instead
// show list
router.get('/:userId/:listId/', (req, res) => {
    unpackParams(req);
    debug(`show list: ${isDefCol(listId)}`);
    const list = getList(userId, listId);
    const items = list == undefined ? "" : list.items;
    debug('items: ' + items);
    res.render('show', {userId: userId, listId: listId, items: items});
})

// update with edits from show
router.patch('/:userId/:listId', (req, res) => {
    debug(`body ${isDefCol(req.body)}`)
    unpackParams(req);
    unpackBody(req);
    debug(`updating list: ${isDefCol(listId)}`);
    // TODO DRY this up - same as show
    const list = updateList(userId, listId, items);
    // const items = list == undefined ? "" : list.items;
    debug('items: ' + items);
    res.render('edit', {listId: listId, items: items});
})

// delete list
router.post('/:userId/delete/:listId/', (req, res) => {
    unpackParams(req);
    removeList(userId, listName);
    res.redirect(path.join('/lists', userId));
})

function unpackParams(req) {
    userId = req.params.userId;
    listId = req.params.listId;
    debug(`userId: ${isDefCol(userId)} listId: ${isDefCol(listId)})`);
}

function unpackBody(req){
    listName = req.body.listname;
    items = req.body.items;
    debug(`listname: ${isDefCol(listName)} items: ${isDefCol(items)}`)
}

module.exports = router;

