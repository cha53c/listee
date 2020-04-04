const {yellow, green} = require('chalk');

function isDefCol(data) {
    return data == undefined ? yellow(data) : green(data);
}

//TODO figure out how to chain methods so you can use isDefined.colour(item)
function defined(data) {
    return data == undefined ? yellow(data) : green(data);
}


function colour(data) {

}

module.exports = {isDefCol};