const {addList, updateList, removeList, getList} = require('../model/list');
const listStore = require('../model/listStore');

describe("a user", () => {
    const usr1 = {id: 'user 1'};
    const itms1 = ['item 1', 'item 2', 'item 3'];
    const itms2 = ['red', 'green', 'blue'];
    const lst1 = {name: 'list 1', items: itms1};
    beforeEach(() => {
        listStore.emptyStore();
    });

    describe('with no lists in the store it', () => {
        it('should return undefined from getList', () => {
            expect(listStore.hasListsforUser(usr1.id)).toBe(false);
            let list = getList(usr1.id, lst1.name);
            expect(list).toBe(undefined);
        });
        it('should add a new list to the list store for that user', () => {
            expect(listStore.hasListsforUser(usr1.id)).toBe(false);
            addList(usr1.id, lst1.name, lst1.items);
            expect(listStore.hasListsforUser(usr1.id)).toBe(true);
        });
    });

    describe('with an existing list', () => {
        beforeEach(() => {
            addList(usr1.id, lst1.name, lst1.items);
        });

        it('should find a list by the user and list name', () => {
            const list = getList(usr1.id, lst1.name);
            expect(list.id).toBe(lst1.name);
            expect(list.items[0]).toEqual(lst1.items[0]);
        });
        it('should update items in list', () => {
            updateList(usr1.id, lst1.name, itms2);
            const list = getList(usr1.id, lst1.name);
            expect(list.items[0]).toEqual('red');
        });
        it('should remove a list users list store', () => {
            removeList(usr1.id, lst1.name);
            expect(getList(usr1.id, lst1)).toBe(undefined);
        });
        it('should get all lists for a user', () => {
            pending();
        });
    });
})
;