const debug = require('debug');

//temporary user store for demo purposes stores a max of 10 users
const userStore = (function ()
{
    let users = [];

    function init() {
        users = ['1']; //pre-populate for demo
    }

    function addUser(user) {
        if (users.length <= 10 && !isUser(user)) {
            users.push(user);
            debug(userStore);
        }
    }

    function isUser(user) {
        debug(user);
        debug(`checking user exists`);
        debug('users ' + users);
        return users.includes(user);
    }

    return {
        addUser: addUser,
        isUser: isUser,
        init: init,
        users: users
    };

})();

module.exports = userStore;
