const debug = require('debug')('app:listController');
const {red} = require('chalk');
const path = require('path');

const {getListNames, addList, getList, updateList, removeList, getAllLists} = require('../model/list');


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
    const lists = getAllLists(userId);
    res.render('lists', {
        title: 'your lists', heading: 'Listee keeps all your lists here',
        lists: lists, userId: userId
    });

    // const listnames = getListNames(userId);
    // const listCount = `You have ${listnames.length} lists`;
    // debug('listnames: %o', listnames);
    // res.render('lists', {
    //     title: 'your lists', heading: 'Listee keeps all your lists here', listCount: listCount,
    //     listnames: listnames, userId: userId
    // });

}

function getAddListPage(req, res) {
    debug('get add list page');
    unpackParams(req);
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
    // // don't add if list already exits
    // const list = getList(userId, listName);
    // if (list) {
    //     responseMsg.status = ERROR_STATUS;
    //     responseMsg.msg = `list ${listName} already exits`;
    //     debug(`${red(responseMsg.msg)}`);
    //     res.json(responseMsg);
    // }
    const newlist = addList(userId, listName, items);
    // redirect to list show page
    res.redirect(path.join('/lists', userId, newlist.id));
}

function showList(req, res) {
    unpackParams(req);
    debug(`show list for id: %s`, listId );
    const list = getList(userId, listId);
    const items = list === undefined ? [] : list.items;
    debug('listId %s, list name %s, items: %s', list.id, list.name, items);
    res.render('show', {title: list.name, userId: userId, listId: listId, listName: list.name, items: items});
}

function patchList(req, res) {
    debug(`update list`);
    unpackParams(req);
    unpackBody(req);
    // TODO DRY this up - same as show
    const updatedList = updateList(userId, listId, listName, items);
    res.json({"status": SUCCESS_STATUS, "msg": `list updated to ${JSON.stringify(updatedList)}`});
}

function deleteList(req, res) {
    debug('delete list');
    unpackParams(req);
    if (!removeList(userId, listId)) {
        responseMsg.status = ERROR_STATUS;
        responseMsg.msg = `list  ${listId} not found`;
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