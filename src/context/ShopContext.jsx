import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const navigate = useNavigate();
    const currency = 'LKR ';
    const deliveryFee = 1000;
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000').replace(/\/+$/, "");

    // State Management
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null); // Holds decoded user data {id, name, imageUrl}
    const [search, setSearch] = useState('');
    const [showSearch, setshowSearch] = useState(true);

    // --- Authentication & Session Management ---

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${backendUrl}/api/user/login`, { email, password });
            if (res.data.success) {
                const newToken = res.data.token;
                setToken(newToken);
                localStorage.setItem('token', newToken);
                
                const decodedUser = jwtDecode(newToken);
                setUser(decodedUser);
                
                await fetchUserCart(newToken);
                
                toast.success(`Welcome back, ${decodedUser.name}!`);
                navigate('/');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
            if (res.data.success) {
                const newToken = res.data.token;
                setToken(newToken);
                localStorage.setItem('token', newToken);

                const decodedUser = jwtDecode(newToken);
                setUser(decodedUser);

                // New users have an empty cart, so we set it to empty.
                setCartItems({});

                toast.success("Registration successful! Welcome!");
                navigate('/');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
             toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setCartItems({});
        toast.info("You have been logged out.");
        navigate('/');
    };

    // --- Data Fetching ---

    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error("Product fetch error:", error);
            toast.error("Error fetching products");
        }
    };

    const fetchUserCart = async (currentToken) => {
        if (!currentToken) return;
        try {
            const response = await axios.get(`${backendUrl}/api/cart/get`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error("Failed to fetch user cart:", error);
        }
    };

    // --- Cart Actions & Calculations ---

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Please select a product size.");
            return;
        }

        setCartItems(prev => {
            const newCart = { ...prev };
            if (!newCart[itemId]) newCart[itemId] = {};
            newCart[itemId][size] = (newCart[itemId][size] || 0) + 1;
            return newCart;
        });

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                toast.error("Failed to update cart.");
                fetchUserCart(token); // Re-sync on failure
            }
        }
    };

    
    
    // Other cart functions (updateQuantity, getCartCount, getCartAmount) remain the same...
    const getCartCount = () => Object.values(cartItems).reduce((total, sizes) => total + Object.values(sizes).reduce((subTotal, count) => subTotal + count, 0), 0);
    const getCartAmount = () => {
        let totalAmount = 0;
        // Loop through each item ID in the cart
        for (const itemId in cartItems) {
            // Find the full product details from the products list
            const itemInfo = products.find((product) => product._id === itemId);
            
            // Ensure the product exists before proceeding
            if (itemInfo) {
                // Loop through the sizes for the current item
                for (const size in cartItems[itemId]) {
                    // Add the cost (price * quantity) to the total amount
                    totalAmount += itemInfo.price * cartItems[itemId][size];
                }
            }
        }
        return totalAmount;
    };
    
    const updateQuantity = async (itemId, size, quantity) => {
    setCartItems(prevCart => {
        const updatedCart = { ...prevCart };

        if (!updatedCart[itemId]) {
            updatedCart[itemId] = {};
        }

        if (quantity === 0) {
            // Remove size entry
            delete updatedCart[itemId][size];

            // If no sizes left, remove the entire item
            if (Object.keys(updatedCart[itemId]).length === 0) {
                delete updatedCart[itemId];
            }
        } else {
            updatedCart[itemId][size] = quantity;
        }

        return updatedCart;
    });}

    // --- Initialization Effect ---
    useEffect(() => {
        const loadData = async () => {
            await getProductsData();
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                try {
                    const decodedUser = jwtDecode(storedToken);
                    setUser(decodedUser);
                    await fetchUserCart(storedToken);
                } catch (e) {
                    // Handle expired or invalid token
                    logout();
                }
            }
        };
        loadData();
    }, []);

    const contextValue = {
        products, currency, deliveryFee,
        search, setSearch, showSearch, setshowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        token, user,
        // --- Export auth functions ---
        login,
        register,
        logout
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;