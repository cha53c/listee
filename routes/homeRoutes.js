const express = require('express');
// const ejs = require('ejs');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {title: 'Listee home page'});
});

module.exports = router;

