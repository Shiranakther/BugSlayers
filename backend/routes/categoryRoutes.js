const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  addSubcategory,
} = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.post('/add', addCategory);
router.post('/:categoryId/subcategory', addSubcategory);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);

module.exports = router;
