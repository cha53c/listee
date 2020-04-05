const {yellow, green } = require('chalk');

let option;

function isDefCol(data) {
    return data == undefined ? yellow(data) : green(data);
}

//TODO figure out how to chain methods so you can use isDefined.colour(item)
function defined(data) {
}

function colour(data) {

// choose colour based on defined undefined
}
module.exports = { isDefCol };