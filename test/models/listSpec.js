const should = require('chai').should();
const expect = require('chai').expect;

const {addList, updateList, removeList, getList, getListNames } = require('../../model/list');
const listStore = require('../../model/listStore');

describe("a user", () => {
    const usr1 = {id: 'user 1'};
    const itms1 = ['item 1', 'item 2', 'item 3'];
    const itms2 = ['red', 'green', 'blue'];
    const lst1 = {name: 'list 1', items: itms1};

    beforeEach(() => {
        listStore.emptyStore();
    });

    describe('with no lists in the store', () => {
        it('should return undefined from getList', () => {
            const hasLists = listStore.hasListsforUser(usr1.id);
            hasLists.should.be.false;
            let list = getList(usr1.id, lst1.name);
            expect(list).to.be.undefined;
        });
        it('should add a new list to the list store for that user', () => {
            let hasLists = listStore.hasListsforUser(usr1.id);
            hasLists.should.be.false;
            addList(usr1.id, lst1.name, lst1.items);
            hasLists = listStore.hasListsforUser(usr1.id);
            hasLists.should.be.true;
        });
        it('should return an empty string from getAllListNames', ()=>{
            const listnames = getListNames(usr1.id);
            listnames.should.equal("");
        })
    });

    describe('with an existing list', () => {
        beforeEach(() => {
            addList(usr1.id, lst1.name, lst1.items);
        });

        it('should find a list by the user and list name', () => {
            const list = getList(usr1.id, lst1.name);
            expect(list.id).to.equal(lst1.name);
            expect(list.items[0]).to.equal(lst1.items[0]);
        });
        it('should update items in list', () => {
            updateList(usr1.id, lst1.name, itms2);
            const list = getList(usr1.id, lst1.name);
            expect(list.items[0]).to.equal('red');
        });
        it('should remove a list users list store', () => {
            removeList(usr1.id, lst1.name);
            expect(getList(usr1.id, lst1)).to.equal(undefined);
        });
        it('should get all list names', ()=>{
            const listnames = getListNames(usr1.id);
            expect(listnames).to.contain('list 1');
        });
        it('should get all lists for a user');
    });
})
;