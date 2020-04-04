const debug = require('debug')('app:list');
const chalk = require('chalk');
const { yellow } = require('chalk');

const listStore = require('../model/listStore');
const { isDefCol } = require('../utils/chalkbox');

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
    debug(`get list: ${isDefCol(listname)} for user: ${yellow(userId)}`);
    const userListStore = listStore.getListsByUser(userId);
    return  userListStore && userListStore.lists.get(listname);
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

function getAllLists(userId) {
    const usersListStore = listStore.getListsByUser(userId);
    if (usersListStore) {
        return usersListStore.lists;
    }
    return undefined;
}

module.exports = {addList, getList, updateList, removeList, getAllLists}