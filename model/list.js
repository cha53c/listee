const listStore = require('../model/listStore');
const debug = require('debug')('app:list');
const chalk = require('chalk');

List = {
    id: undefined,
    items: []
}

function addList(userId, listname, items) {
    let usersLists;
    const list = Object.create(List);
    list.id = listname;
    list.items = items;

    if (!listStore.hasListsforUser(userId)) {
        debug(`creating a new list store for user: ${chalk.yellow(userId)}`);
        usersLists = listStore.createListStoreForUser(userId);
        usersLists.lists.set(list.id, list);
    } else {
        usersLists = listStore.getListsByUser(userId);
        usersLists.lists.set(listname, list);
    }
}

function getList(userId, listname) {
    debug(`get list: ${chalk.yellow(listname)} for user: ${chalk.yellow(userId)}`);
    const list = listStore.getListsByUser(userId).lists.get(listname);
    debug(list);
    return list;
}

function removeList(userId, listname) {
    let usersLists = listStore.getListsByUser(userId);
    usersLists.lists.delete(listname);
}

function updateList(userId, listname, items) {
    debug(`update list: ${chalk.yellow(listname)} for user: ${chalk.yellow(userId)}`);
    const list = getList(userId, listname);
    debug(`list before update: ${JSON.stringify(list)}`);
    list.items = items;
    debug(`list after update: ${JSON.stringify(list)}`);
}


module.exports = {addList, getList, updateList, removeList}