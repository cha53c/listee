const debug = require('debug');

let users = ['1'];

const userStore = (function ()
{
    function addUser(user) {
        if (!isUser(user)) {
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
        isUser: isUser
    };

})();

module.exports = userStore;
