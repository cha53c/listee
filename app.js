const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to Listee');
});

app.listen(3000, () => {
    debug(`Listee is listening to you on port ${chalk.green('3000')}`);
});