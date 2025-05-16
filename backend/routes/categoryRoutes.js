// routes/categoryRouter.js

const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    addCategory,
    deleteCategory,
    updateCategory
} = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.post('/add', addCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);

module.exports = router;
