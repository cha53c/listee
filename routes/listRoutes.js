const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('lists', {title: 'your lists', heading: 'Listee keeps all your lists are here'});
});

module.exports = router;
