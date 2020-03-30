const { createListStoreForUser, getListsByUser, listStoreSize, hasListsforUser } = require('../model/listStore');

describe("The list store", () => {
    it('should create new list store for the user and add it to the store', () => {
        const userId = 'user 1'
        const usersLists = createListStoreForUser(userId);
        expect(usersLists.id).toBe(userId);
        expect(listStoreSize()).toBe(1);
        expect(hasListsforUser(userId)).toBe(true);
    });
    it('should get a users lists by user id', () => {
        const userId = 'user 1'
        createListStoreForUser(userId);
        let userLists = getListsByUser(userId);
        expect(userLists.id).toEqual(userId);
    });
    it('should not add a  new list store for the user who already has one', () => {
        const userId = 'user 1';
        createListStoreForUser(userId);
        expect(hasListsforUser(userId)).toBe(true);
        let listSize = listStoreSize();
        createListStoreForUser(userId);
        expect(hasListsforUser(userId)).toBe(true);
        expect(listStoreSize()).toEqual(listSize);
    });
});