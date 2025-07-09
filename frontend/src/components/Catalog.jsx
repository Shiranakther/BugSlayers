import { useEffect, useState } from 'react';
import axios from 'axios';
import '../ProductCatalog.css';

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/catalog/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setActiveCategory(res.data[0]._id);  // Select first category by default
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Load subcategories when activeCategory changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!activeCategory) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/catalog/subcategories?categoryId=${activeCategory}`);
        setSubcategories(res.data);
        if (res.data.length > 0) {
          setActiveSubcategory(res.data[0]._id);  // Select first subcategory by default
        } else {
          setActiveSubcategory(null);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setSubcategories([]);
        setActiveSubcategory(null);
        setProducts([]);
        setFilteredProducts([]);
      }
    };
    fetchSubcategories();
  }, [activeCategory]);

  // Load products when activeSubcategory changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeSubcategory) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/catalog/products-by-subcategory?subcategoryId=${activeSubcategory}`);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
        setFilteredProducts([]);
      }
    };
    fetchProducts();
  }, [activeSubcategory]);

  // Filter products based on search and stock status
  useEffect(() => {
    let result = products;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.productName?.toLowerCase().includes(q) ||
          p.code?.toLowerCase().includes(q)
      );
    }

    if (stockFilter === 'in') {
      result = result.filter((p) => p.quantity > 0);
    } else if (stockFilter === 'out') {
      result = result.filter((p) => p.quantity <= 0);
    }

    setFilteredProducts(result);
  }, [searchQuery, stockFilter, products]);

  return (
    <div className="cat-container mt-4">
      {/* Category Tabs */}
      <ul className="nav cat-nav-tabs mb-2">
        {categories.map((cat) => (
          <li className="nav-item" key={cat._id}>
            <button
              className={`cat-nav-link ${activeCategory === cat._id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat._id)}
            >
              {cat.categoryName}
            </button>
          </li>
        ))}
      </ul>

      {/* Subcategory Dropdown */}
      {subcategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subcategory-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Subcategory:</label>
          <select
            id="subcategory-select"
            value={activeSubcategory || ''}
            onChange={(e) => setActiveSubcategory(e.target.value)}
            className="form-select"
            style={{ maxWidth: '300px', display: 'inline-block' }}
          >
            {subcategories.map((subcat) => (
              <option key={subcat._id} value={subcat._id}>
                {subcat.subcategoryName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Search and Filter */}
      <div className="cat-search-bar-container mb-3 d-flex align-items-center gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <div className="d-flex gap-2">
          <button className={`btn-xs ${stockFilter === 'all' ? 'btn-custom-all' : 'btn-outline-custom-all'}`} onClick={() => setStockFilter('all')}>All</button>
          <button className={`btn-xs ${stockFilter === 'in' ? 'btn-custom-in' : 'btn-outline-custom-in'}`} onClick={() => setStockFilter('in')}>In Stock</button>
          <button className={`btn-xs ${stockFilter === 'out' ? 'btn-custom-out' : 'btn-outline-custom-out'}`} onClick={() => setStockFilter('out')}>Out of Stock</button>
        </div>
      </div>

      {/* Product Cards */}
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="col cat-col mb-4" key={product._id}>
              <div className="card cat-card compact-spacing h-100 shadow-sm">
                {product.image && (
                  <img
                    src={`http://localhost:5000/uploads/${product.image}`}
                    className="cat-card-img-top"
                    alt={product.productName}
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                )}
                <div className="cat-card-body">
                  <h5 className="cat-card-title"><strong>{product.productName}</strong></h5>
                  <p className="cat-card-text mb-1"><strong>Item Code: {product.code}</strong></p>
                  <p className="cat-card-text mb-1"><strong>Price: Rs. {product.sellingPrice}</strong></p>
                  <p className="cat-card-text mb-1">
                    <strong>Stock Status:</strong>{' '}
                    <span className={`badge ${product.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products available in this subcategory.</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;
