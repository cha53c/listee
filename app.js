const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk');
const path = require('path');
const ejs = require('ejs');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const home = require(path.join(__dirname, 'routes', 'homeRoutes'));
const lists = require(path.join(__dirname, 'routes', 'listRoutes'));
const auth = require(path.join(__dirname, 'routes', 'authRoutes'));
const app = express();

process.title = "listeeApp";

debug('node environment = %s', process.env.NODE_ENV);

if(process.env.NODE_ENV !== 'test' ){
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

app.set('views', ['./views', 'views/list', 'views/auth'] );
app.set('view engine', 'ejs');

const PORT = 3000;
const server = app.listen(PORT, () => {
    debug(`Listee is listening to you on port ${chalk.green(PORT)}`);
});

function stop(){
    server.close();
}

module.exports = {app, stop};