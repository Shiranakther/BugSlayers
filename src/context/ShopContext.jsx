//Shop context
import { createContext,useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'LKR ';
    const deliveryFee = 1000;
    const backendUrl=(import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000').replace(
      /\/+$/,
      ""
    );
    const [search, setSearch] = useState('');
    const [showSearch, setshowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const[products,setProducts]= useState([]);
    const[token,setToken]=useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error("Select Product Size")
            return;          
        }

         let cartData = JSON.parse(JSON.stringify(cartItems));


         if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } 
            else {
                cartData[itemId][size] = 1;
            }            
         } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
         }
         console.log("Updated cart data:", cartData);
         setCartItems(cartData);
  
  if (token){
    try {
        const userId=JSON.parse(atob(token.split('.')[1])).id;
        await axios.post(backendUrl + '/api/cart/add', { userId,itemId, size },{headers:{Authorization:token}}
        
         );} catch (error) {
    console.error("Failed to add item to cart:", error);
    toast.error(error.message)
        
    }
  }
};      

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems [items][item] > 0){
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.error("Cart calculation error:", error);
                    
                }}}
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) =>{
        let cartData = JSON.parse(JSON.stringify(cartItems));
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    };

   const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
        let itemInfo = products.find((product) => product._id === itemId);
        if (!itemInfo) 
            continue;
        
        for (const size in cartItems[itemId]) {
            try {
                if (cartItems[itemId][size]) {
                    totalAmount += itemInfo.price * cartItems[itemId][size];
                }
            } catch (error) {
                console.log.error("Cart amount calculation error:", error);
            }
        }
    }
    return totalAmount;
};

 const getProductsData= async () => {
     try {
        const response= await axios.get(backendUrl + '/api/product/list')
        if(response.data.success){
            setProducts(response.data.products)}
        else{
            toast.error(response.data.message);
        }
     } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to fetch products");
     }
    };
    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));

        }
    },[])
     
    const value = {
        products , currency, deliveryFee,
        search, setSearch, showSearch, setshowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken,token

    };

    


    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
