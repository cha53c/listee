const debug = require ('debug')('app:listStore');
const chalk = require ('chalk');

// stores a list of all users lists by id
const listStore = new Map();

UserList = {
    id: undefined,
    lists: undefined
}

function createListStoreForUser(userId) {
    let usersLists = Object.create(UserList);
    usersLists.id = userId;
    usersLists.lists = new Map();
    debug(`created list store for ${chalk.green(userId)}`);
    listStore.set(userId, usersLists);
    debug('added new users lists store to the list store');
    return usersLists;
}

function getListsByUser(userId) {
    return listStore.get(userId);
}

function listStoreSize() {
    return listStore.size;
}

function hasListsforUser(userId){
    return listStore.has(userId);
}

function emptyStore(){
    listStore.clear();
}


module.exports = { createListStoreForUser , getListsByUser, listStoreSize, hasListsforUser, emptyStore}
