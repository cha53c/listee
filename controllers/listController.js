const debug = require('debug')('app:listController');
const {red} = require('chalk');
const path = require('path');

const {getListNames, addList, getList, updateList, removeList} = require('../model/list');


let userId, listId, listName, items;

const SUCCESS_STATUS = 'success';
const ERROR_STATUS = 'err';

const responseMsg = {
    status: "",
    msg: ""
};

function getUserHome(req, res) {
    debug('get user\'s list home');
    unpackParams(req);
    const listnames = getListNames(userId);
    const listCount = 'You have ' + listnames.length + ' lists';
    debug('listnames: %o', listnames);
    res.render('lists', {
        title: 'your lists', heading: 'Listee keeps all your lists here', listCount: listCount,
        listnames: listnames, userId: userId
    });
}

function getAddListPage(req, res) {
    debug('get add list page');
    unpackParams(req);
    // used to check if listname is aready a taken
    const listnames = getListNames(userId);
    res.render('add', {
        title: 'add new list',
        heading: 'Create your new list',
        userId: userId,
        listnames: listnames
    });
}

function addNewList(req, res) {
    debug('add list');
    unpackParams(req);
    unpackBody(req);
    // TODO don't add if list already exits
    const list = getList(userId, listName);
    if (list) {
        responseMsg.status = ERROR_STATUS;
        responseMsg.msg = 'list ' + listName + " already exits";
        debug(`${red(responseMsg.msg)}`);
        res.json(responseMsg);
    }
    addList(userId, listName, items);
    // res.render('show', {userId: userId, listId: listId, items: items});
    // res.json({"status": "success", "msg": listName + " added"});
    res.redirect(path.join('/lists', userId, listName));
}

function showList(req, res) {
    debug(`show list`);
    unpackParams(req);
    const list = getList(userId, listId);
    const items = list === undefined ? "" : list.items;
    debug('items: %s', items);
    res.render('show', {title: listId, userId: userId, listId: listId, items: items});
}

function patchList(req, res) {
    debug(`update list`);
    unpackParams(req);
    unpackBody(req);
    // TODO DRY this up - same as show
    updateList(userId, listId, items);
    res.json({"status": SUCCESS_STATUS, "msg": 'list updated to ' + items});
}

function deleteList(req, res) {
    debug('delete list');
    unpackParams(req);
    if (!removeList(userId, listId)) {
        responseMsg.status = ERROR_STATUS;
        responseMsg.msg = 'list ' + listId + " not found";
        debug(`${red(responseMsg.msg)}`);
        res.json(responseMsg);
    }
    res.json({"status": SUCCESS_STATUS, "msg": 'list ' + listId + ' deleted'});
}

function deleteMultipleLists(req, res) {
    debug('delete multiple lists');
    unpackParams(req);
    let deletedLists = req.body.listnames;
    let failedLists = "";
    for (const listName of deletedLists) {
        // TODO handle errors if remove list returns false still returns 500 if list not found
        if (!removeList(userId, listName)) {
            responseMsg.status = ERROR_STATUS;
            failedLists += listName + " ";
        }
    }
    if (responseMsg.status === ERROR_STATUS) {
        responseMsg.msg = failedLists;
        debug(`${red(responseMsg.msg)}`);
        res.json(responseMsg);
    }
    res.json({"status": SUCCESS_STATUS, "msg": deletedLists + " list deleted"});
}

function unpackParams(req) {
    userId = req.params.userId;
    listId = req.params.listId;
}

function unpackBody(req) {
    listName = req.body.listname;
    items = req.body.items;
}

module.exports = {
    getUserHome, getAddListPage,
    addNewList, showList,
    deleteList, patchList,
    deleteMultipleLists
};