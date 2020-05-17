const express = require('express');
const router = express.Router();
const debug = require('debug')('app:beeRoutes');
const {green} = require('chalk');
const beeController = require('../controllers/beeController');

router.route('/test').get(beeController.getTest);

router.route('/test/:workId').get(beeController.getAudio);



module.exports = router;