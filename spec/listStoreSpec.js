const { addListsForUser, getListsByUser, listStoreSize, hasListsforUser } = require('../model/listStore');

describe("The list store", () => {
    it('should create new list store for the user and add it to the store', () => {
        const userId = 'user 1'
        addListsForUser(userId);
        expect(listStoreSize()).toBe(1);
        expect(hasListsforUser(userId)).toBe(true);
    });
    it('should get a users lists by user id', () => {
        const userId = 'user 1'
        addListsForUser(userId);
        let userLists = getListsByUser(userId);
        expect(userLists.id).toEqual(userId);
    });
    it('should not add a  new list store for the user who already has one', () => {
        const userId = 'user 1'
        addListsForUser(userId);
        expect(hasListsforUser(userId)).toBe(true);
        let listSize = listStoreSize();
        addListsForUser(userId);
        expect(hasListsforUser(userId)).toBe(true);
        expect(listStoreSize()).toEqual(listSize);
    });

});