const express = require('express');
const debug = require('debug')('app:listRoutes');
const {green} = require('chalk');

const {isDefCol} = require('../utils/chalkbox');
const {
    getUserHome, getAddListPage, addNewList, showList,
    patchList, deleteList, deleteMultipleLists
} = require('../controllers/listController');

const router = express.Router();

router.use('/:userId/', (req, res, next) => {
    if (req.method === "PATCH") {
        debug("request body %o", req.body);
    }
    next();
});

router.use('/:userId/create/', (req, res, next) => {
    if (req.method === "POST") {
        debug("request body %o", req.body);
    }
    next();
});

router.use('/:userId/:listId/', (req, res, next) => {
    if (req.method === "PATCH") {
        debug("request body %o", req.body);
    }
    next();
});

router.route('/:userId')
    .get(getUserHome)
    .patch(deleteMultipleLists);
router.route('/:userId/create/')
    .get(getAddListPage)
    .post(addNewList);
router.route('/:userId/:listId/')
    .get(showList)
    .patch(patchList)
    .delete(deleteList);

router.param('userId', (req, res, next) => {
    debug(`param userId: ${isDefCol(req.params.userId)}`);
    if (req.params.userId === "1") {
        debug(`user ${green(req.params.userId)} authorised`);
        next();
    } else {
        debug(`user ${green(req.params.userId)} not authorised`);
        // TODO create page to render here
        res.status(403).send('Forbidden');
    }

});

router.param('listId', (req, res, next) => {
    debug(`param listId: ${isDefCol(req.params.listId)}`);
    // TODO validate and sanitise listId
    next();
});

module.exports = router;

