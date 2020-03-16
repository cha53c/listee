const express = require('express');
const router = express.Router();

router.post('/signUp', (req, res) => {
    // res.render('home', {title: 'Listee home page'});
});

router.post('/signIn', (req, res) => {
    // res.render('home', {title: 'Listee home page'});
});

router.get('/', (req, res) => {
    res.render('signin');
});



module.exports = router;