//Shop context
import { createContext, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'LKR ';
    const deliveryFee = 1000;
    const [search, setSearch] = useState('');
    const [showSearch, setshowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
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
    }

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
    }

    const updateQuantity = async (itemId, size, quantity) =>{
        let cartData = JSON.parse(JSON.stringify(cartItems));
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    }

   const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
        let itemInfo = products.find((product) => product._id === itemId);
        if (!itemInfo) {
            continue;
        }
        for (const size in cartItems[itemId]) {
            try {
                if (cartItems[itemId][size]) {
                    totalAmount += itemInfo.price * cartItems[itemId][size];
                }
            } catch (error) {
                console.error("Cart amount calculation error:", error);
            }
        }
    }
    return totalAmount;
};


    const value = {
        products , currency, deliveryFee,
        search, setSearch, showSearch, setshowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity,
        getCartAmount, navigate

    }

    


    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
