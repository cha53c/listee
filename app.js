const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk');
const path = require('path');
const ejs = require('ejs');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const envLoad = require('dotenv').config();

const home = require(path.join(__dirname, 'routes', 'homeRoutes'));
const lists = require(path.join(__dirname, 'routes', 'listRoutes'));
const auth = require(path.join(__dirname, 'routes', 'authRoutes'));
const bee = require(path.join(__dirname, 'routes', 'beeRoutes'));
const app = express();

if (envLoad.error) {
    throw envLoad.error;
}

process.title = "listeeApp";

debug('.env variable %s', envLoad.parsed);
debug('node environment: %s', process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('tiny'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/static', express.static('public/css'));
app.use('/static', express.static('public/js'));

// set up the routes
app.use('/', home);
app.use('/lists', lists);
app.use('/auth', auth);
app.use('/bee', bee);

app.set('views', ['./views', 'views/list', 'views/auth', 'views/bee']);
app.set('view engine', 'ejs');

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    debug(`Listee is listening to you on port ${chalk.green(PORT)}`);
});

function stop() {
    server.close();
}

module.exports = {app, stop};