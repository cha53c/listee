const express = require('express');
const router = express.Router();

router.get('/:userId', (req, res) => {
    if(req.params.userId == 1) { //simulate logged in
        res.render('lists', {title: 'your lists', heading: 'Listee keeps all your lists are here'});
    } else {
        res.redirect('/'); // if not logged in redirect back to home page
    }
});

router.get('/create', (req, res) => {
    res.render('createList', {title: 'create new list', heading: 'Create your new list'});
});

router.get('/:userId/:listId', (req, res) => {
    res.render('show', { listId: req.params.listId});
})

module.exports = router;

