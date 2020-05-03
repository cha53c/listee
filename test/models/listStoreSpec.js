const should = require('chai').should();
const expect = require('chai').expect;

const { createListStoreForUser, getListsByUser, listStoreSize, hasListsforUser } = require('../../model/listStore');

describe("The list store", () => {
    it('should create a list store for a new user', () => {
        const userId = 'user 1'
        const usersLists = createListStoreForUser(userId);
        let usersListsId = usersLists.id;
        usersListsId.should.equal(userId);
        listStoreSize().should.to.equal(1);
        hasListsforUser(userId).should.be.true;
    });
    it('should get a users lists by user id', () => {
        const userId = 'user 1'
        createListStoreForUser(userId);
        let userLists = getListsByUser(userId);
        expect(userLists.id).to.equal(userId);
    });
    it('should not add a new list store for the user who already has one', () => {
        const userId = 'user 1';
        createListStoreForUser(userId);
        hasListsforUser(userId).should.be.true;
        let listSize = listStoreSize();
        createListStoreForUser(userId);
        hasListsforUser(userId).should.be.true;
        expect(listStoreSize()).to.equal(listSize);
    });
});