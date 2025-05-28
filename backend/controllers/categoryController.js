const Category = require('../models/Category');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching category items' });
  }
};

// Add a new category
const addCategory = async (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  try {
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    const newCategory = new Category({ categoryName, subcategories: [] });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Error adding item' });
  }
};

// Add a subcategory to an existing category
const addSubcategory = async (req, res) => {
  const { categoryId } = req.params;
  const { subcategoryName } = req.body;

  if (!subcategoryName) {
    return res.status(400).json({ error: 'Subcategory name is required' });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (category.subcategories.includes(subcategoryName)) {
      return res.status(400).json({ error: 'Subcategory already exists' });
    }

    category.subcategories.push(subcategoryName);
    await category.save();

    res.status(200).json({ message: 'Subcategory added successfully', category });
  } catch (error) {
    console.error('Error adding subcategory:', error);
    res.status(500).json({ error: 'Error adding subcategory' });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Error updating category' });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  addSubcategory,
  deleteCategory,
  updateCategory,
};
