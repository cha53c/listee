const express = require('express');
const debug = require('debug')('app:listRoutes');
const {green} = require('chalk');

const {isDefCol} = require('../utils/chalkbox');
const listController = require('../controllers/listController');
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
    .get(listController.getUserHome)
    .patch(listController.deleteMultipleLists);
router.route('/:userId/create/')
    .get(listController.getAddListPage)
    .post(listController.addNewList);
router.route('/:userId/:listId/')
    .get(listController.showList)
    .patch(listController.patchList)
    .delete(listController.deleteList);

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

