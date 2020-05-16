const debug = require('debug')('app:list');
const { nanoid } = require('nanoid');

const listStore = require('../model/listStore');
const {isDefCol} = require('../utils/chalkbox');

const List = {
    _id: undefined,
    _name: undefined,
    items: [], // TODO add accessor properties for items
    set id(id){
        this._id = id;
    },
    get id(){
        return this._id;
    },
    set name(name){
      this._name = name;
    },
    get name(){
        return this._name;
    }
};

function addList(userId, listname, items) {
    let usersLists;
    const list = Object.create(List);
    // list.id = listname;
    list.id = nanoid(12);
    list.name = listname;
    list.items = items;

    if (!listStore.hasListsforUser(userId)) {
        debug(`creating a new list store for user: ${isDefCol(userId)}`);
        usersLists = listStore.createListStoreForUser(userId);
    } else {
        usersLists = listStore.getListsByUser(userId);
    }
    usersLists.lists.set(list.id, list);
    return list;
}

function getList(userId, listId) {
    debug(`get list: ${isDefCol(listId)} for user: ${isDefCol(userId)}`);
    const userListStore = listStore.getListsByUser(userId);
    return userListStore && userListStore.lists.get(listId);
}

// returns false if element does not exist
function removeList(userId, listname) {
    let usersLists = listStore.getListsByUser(userId);
    return usersLists.lists.delete(listname);
}

function updateList(userId, listId, listname, items) {
    debug(`update list: ${listId} ${isDefCol(listname)} for user: ${isDefCol(userId)}`);
    const list = getList(userId, listId);
    debug('list before update: %o', list);
    if(list.name !== listname){
        list.name =listname;
    }
    list.items = items;
    debug('list after update: %o', list);
    return list;
}

function getAllLists(userId) {
    const usersListStore = listStore.getListsByUser(userId);
    if (usersListStore) {
        const lists = Array.from(usersListStore.lists.values());
        return lists
    }
    return [];
}

function getListNames(userId) {
    const lists = getAllLists(userId);
    // if(lists === undefined) {
    //     return [];
    // }
    let listNames = [];
    for(const l of lists.values()){
        listNames.push(l.name);
    }
    return listNames;
}

module.exports = {addList, getList, updateList, removeList, getAllLists, getListNames};