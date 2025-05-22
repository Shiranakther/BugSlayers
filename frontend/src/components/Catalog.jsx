import { useEffect, useState } from 'react';
import axios from 'axios';
import '../ProductCatalog.css';

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'in', 'out'


  // Fetch all categories on load
  useEffect(() => {
    axios.get('http://localhost:5000/api/catalog/categories')
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setActiveTab(res.data[0]._id);
        }
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch products for selected category
  useEffect(() => {
    if (activeTab) {
      axios.get(`http://localhost:5000/api/catalog/products?categoryId=${activeTab}`)
        .then((res) => {
          setProducts(res.data);
          setFilteredProducts(res.data); // Initially show all in category
          setSearchQuery(''); // Reset search when tab changes
        })
        .catch((err) => console.error('Error fetching products:', err));
    }
  }, [activeTab]);

  // Search within current category's products
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      product.productName?.toLowerCase().includes(query) ||
      product.code?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    let filtered = products.filter((product) =>
      product.productName?.toLowerCase().includes(query) ||
      product.code?.toLowerCase().includes(query)
    );
  
    if (stockFilter === 'in') {
      filtered = filtered.filter((p) => p.quantity > 0);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter((p) => p.quantity <= 0);
    }
  
    setFilteredProducts(filtered);
  }, [searchQuery, stockFilter, products]);
  

  return (
    <div className="cat-container mt-4">
      {/* Category Tabs */}
      <ul className="nav cat-nav-tabs mb-4">
        {categories.map((category) => (
          <li className="nav-item" key={category._id}>
            <button
              className={`cat-nav-link ${activeTab === category._id ? 'active' : ''}`}
              onClick={() => setActiveTab(category._id)}
            >
              {category.categoryName}
            </button>
          </li>
        ))}
      </ul>
  
      <div className="cat-search-bar-container">
      {/* Search Bar */}
      <div className="cat-search">
        <input
          type="text"
          className="form-control"
          placeholder="Search within this category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="d-flex gap-2">
        <button
          className={`btn-1 btn-xs ${stockFilter === 'all' ? 'btn-custom-all' : 'btn-outline-custom-all'}`}
          onClick={() => setStockFilter('all')}
        >
        All
        </button>
        <button
          className={`btn-2 btn-xs ${stockFilter === 'in' ? 'btn-custom-in' : 'btn-outline-custom-in'}`}
          onClick={() => setStockFilter('in')}
        >
        In Stock
        </button>
        <button
          className={`btn-3 btn-xs ${stockFilter === 'out' ? 'btn-custom-out' : 'btn-outline-custom-out'}`}
          onClick={() => setStockFilter('out')}
        >
        Out of Stock
        </button>
      </div>
    </div>


  
      {/* Product Grid */}
      <div className="row ">
        {filteredProducts.length ? (
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
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
  
};

export default Catalog;
