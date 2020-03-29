// stores a list of all users lists by userId
const listStore = new Map();

UserList = {
    id: undefined,
    lists: undefined
}

function addListsForUser(userId) {
    let usersLists = Object.create(UserList);
    usersLists.id = userId;
    usersLists.lists = new Map();
    console.log('Created list store for : ' + userId);
    listStore.set(userId, usersLists);
    console.log('added new users lists store to the list store')
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


module.exports = {addListsForUser, getListsByUser, listStoreSize, hasListsforUser}
