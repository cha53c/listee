const express = require('express');
const {
    getUserHome, getAddListPage, addNewList, showList,
    patchList, deleteList, deleteMultipleLists
} = require('../controllers/listController');

const router = express.Router();

router.get('/:userId', getUserHome)
    .patch('/:userId', deleteMultipleLists);
router.get('/:userId/create/', getAddListPage)
    .post('/:userId/create/', addNewList);
router.get('/:userId/:listId/', showList)
    .patch('/:userId/:listId', patchList)
    .delete('/:userId/:listId', deleteList);

module.exports = router;

