const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk');
const path = require('path');
const ejs = require('ejs');
const morgan = require('morgan');

const home = require(path.join(__dirname, 'routes', 'homeRoutes'));
const lists = require(path.join(__dirname, 'routes', 'listRoutes'));
const auth = require(path.join(__dirname, 'routes', 'authRoutes'));
const app = express();

app.use(morgan('tiny'));

// set up the routes
app.use('/', home);
app.use('/lists', lists);
app.use('/auth', auth);

app.set('views', './views');
app.set('view engine', 'ejs');

app.listen(3000, () => {
    debug(`Listee is listening to you on port ${chalk.green('3000')}`);
});