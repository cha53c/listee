const debug = require('debug')('app:listController');
const {red} = require('chalk');
const path = require('path');

const {getListNames, addList, getList, updateList, removeList, getAllLists} = require('../model/list');
const userListStore = require('../model/list');


let userId, listId, listName, items;

const SUCCESS_STATUS = 'success';
const ERROR_STATUS = 'err';

const responseMsg = {
    status: "",
    msg: ""
};

const ResponseMessage = {
    _status: "",
    _text: "",
    set status(status) {
        this._status = status;
    },
    get status() {
        return this._status;
    },
    set text(text) {
        this._text = text;
    },
    get text() {
        return this._text;
    }
};

function getUserHome(req, res) {
    debug('get user\'s list home');
    unpackParams(req);
    const lists = getAllLists(userId);
    res.render('lists', {
        title: 'your lists', heading: 'Listee keeps all your lists here',
        lists: lists, userId: userId
    });
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
    const resMsg = Object.create(ResponseMessage);
    unpackParams(req);
    unpackBody(req);
    const allNames = getListNames(userId);
    if (allNames.includes(listName)) {
        resMsg.status = ERROR_STATUS;
        resMsg.text = `list ${listName} already exits`;
        debug(`${red(resMsg.text)}`);
        return res.json(resMsg);
    }
    const newlist = addList(userId, listName, items);
    // redirect to list show page
    res.redirect(path.join('/lists', userId, newlist.id));
}

function showList(req, res) {
    unpackParams(req);
    debug(`show list for id: %s`, listId);
    const list = userListStore.getList(userId, listId);
    if(list){
        debug('listId %s, list name %s, items: %s', list.id, list.name, list.items);
        res.render('show', {title: list.name, userId: userId, listId: listId, listName: list.name, items: list.items});
    } else {
        res.render('error', {title: 'error page', errorMsg: `list ${listId} not found`});
    }
}

function patchList(req, res) {
    const resMsg = Object.create(ResponseMessage);
    debug(`update list`);
    unpackParams(req);
    unpackBody(req);
    // TODO DRY this up - same as show
    const updatedList = updateList(userId, listId, listName, items);
    // TODO handle errors
    resMsg.status = SUCCESS_STATUS;
    resMsg.txt = `list updated to ${JSON.stringify(updatedList)}`;
    res.json(resMsg);
}

function deleteList(req, res) {
    debug('delete list');
    const resMsg = Object.create(ResponseMessage);
    unpackParams(req);
    if (!removeList(userId, listId)) {
        resMsg.status = ERROR_STATUS;
        resMsg.text = `list  ${listId} not found`;
    } else {
        resMsg.status = SUCCESS_STATUS;
        resMsg.text = `list ${listId} deleted`;
    }
    debug(`${responseMsg.msg}`);
    res.json(resMsg);
}

function deleteMultipleLists(req, res) {
    const resMsg = Object.create(ResponseMessage);
    debug('delete multiple lists');
    unpackParams(req);
    let deletedLists = req.body.listnames;
    let failedLists = "";
    for (const listName of deletedLists) {
        // TODO handle errors if remove list returns false still returns 500 if list not found
        if (!removeList(userId, listName)) {
            failedLists += listName + " ";
        }
    }
    if (failedLists != "") {
        resMsg.status = ERROR_STATUS;
        resMsg.text = failedLists;
    } else {
        resMsg.status = SUCCESS_STATUS;
        resMsg.text = `deleted ${deletedLists}`;
    }
    debug(`${resMsg.text}`);
    res.json(resMsg);
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
    deleteMultipleLists,
    SUCCESS_STATUS,
    ERROR_STATUS,
};