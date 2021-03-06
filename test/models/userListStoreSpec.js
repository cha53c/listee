const should = require('chai').should();
const expect = require('chai').expect;
const rewire = require('rewire');
const sinon = require('sinon');

const {addList, updateList, removeList, getList, getListNames} = require('../../model/userListStore');
const userListStore = rewire('../../model/userListStore');
const listStore = require('../../model/listStore'); // TODO stub this out

describe("userListStore", () => {
    const usr1 = {id: 'user 1'};
    const itms1 = ['item 1', 'item 2', 'item 3'];
    const itms2 = ['red', 'green', 'blue'];
    const lst1 = {name: 'list 1', items: itms1};

    beforeEach(() => {
        listStore.emptyStore();
    });

    describe('add list', function () {
        it('should create a unique id when adding a new list');
        it('should not add the list if the id already exits ');
    });

    describe('with no lists in the store', () => {
        it('should return undefined from getList', () => {
            const hasLists = listStore.hasListsforUser(usr1.id);
            hasLists.should.be.false;
            let list = userListStore.getList(usr1.id, lst1.name);
            expect(list).to.be.undefined;
        });
        it('should add a new list to the list store for that user', () => {
            let hasLists = listStore.hasListsforUser(usr1.id);
            hasLists.should.be.false;
            userListStore.addList(usr1.id, lst1.name, lst1.items);
            hasLists = listStore.hasListsforUser(usr1.id);
            hasLists.should.be.true;
        });
        it('should return an empty array from getAllListNames', () => {
            const listnames = userListStore.getListNames(usr1.id);
            listnames.should.deep.equal([]);
        })
    });

    describe('with an existing list', () => {
        let existingList;
        beforeEach(() => {
            existingList = userListStore.addList(usr1.id, lst1.name, lst1.items);
        });

        it('should find a list by the user and list id', () => {
            const list = userListStore.getList(usr1.id, existingList.id);
            expect(list.id).to.equal(existingList.id);
            list.name.should.equal(lst1.name);
            expect(list.items[0]).to.equal(lst1.items[0]);
        });
        it('should update list items', () => {
            userListStore.updateList(usr1.id, existingList.id, lst1.name, itms2);
            const list = userListStore.getList(usr1.id, existingList.id);
            expect(list.items[0]).to.equal('red');
        });
        it('should not update list name and items', function () {
            userListStore.updateList(usr1.id, existingList.id, 'new name', itms2);
            const list = userListStore.getList(usr1.id, existingList.id);
            list.name.should.equal('new name');
            list.items.should.equal(itms2);
            expect(list.items[0]).to.equal('red');
        });

        it('should remove a list users list store', () => {
            userListStore.removeList(usr1.id, existingList.id);
            const list = userListStore.getList(usr1.id, existingList.id);
            expect(list).to.equal(undefined);
        });
        it('should get all list names', () => {
            const listnames = userListStore.getListNames(usr1.id);
            expect(listnames).to.contain('list 1');
        });
        it('should get all lists for a user');
    });
    describe('get list names', function () {
        it('should return empty array if no lists found', function () {
            const listnames = userListStore.getListNames('1111');
            listnames.should.deep.equal([]);
        });
    });
});