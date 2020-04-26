const userStore = require('../../model/userStore.js');
const debug = require('debug')('app:userStoreSpec');

describe("add users to user store", ()=>{
    it('should have user 1 already populated', ()=> {
        userStore.init();
        expect(userStore.isUser('1')).toBe(true);
    })

    it("should add a user and be able to retrieve it", () => {
        let user = "bob";
        userStore.init();
        userStore.addUser(user);
        expect(userStore.isUser(user)).toBe(true);
    })

    it("should not be able to add the same user twice", () => {
        let user = "bob";
        userStore.init();
        userStore.addUser(user);
        let count = userStore.users.length;
        userStore.addUser(user);
        expect(userStore.users.length).toEqual(count);
    })

    it('should not be able to add more than 10 users', () => {
        userStore.init();
        for(let i = 0; i<=10;i++){
            userStore.addUser('user' + i);
        }

        let count = userStore.users.length;
        let user = "bob";
        userStore.addUser(user);
        expect(userStore.isUser(user)).toBe(false);
    })
});