// import React, { useContext, useState, useEffect } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../components/Title';
// import CartTotal from '../components/CartTotal';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const PlaceOrder = () => {
//     const { getCartAmount, products, cartItems, currency, deliveryFee, token, backendUrl } = useContext(ShopContext);
    
//     const [data, setData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         street: "",
//         city: "",
//         district: "",
//         phone: ""
//     });

//     const onChangeHandler = (event) => {
//         const { name, value } = event.target;
//         setData(prevData => ({ ...prevData, [name]: value }));
//     };

//     const placeOrderHandler = async (event) => {
//         event.preventDefault();
        
//         // Prepare order items array
//         let orderItems = [];
//         products.forEach((product) => {
//             if (cartItems[product._id]) {
//                 Object.entries(cartItems[product._id]).forEach(([size, quantity]) => {
//                     if (quantity > 0) {
//                         let itemInfo = { ...product, quantity, size };
//                         orderItems.push(itemInfo);
//                     }
//                 });
//             }
//         });

//         // Prepare order data payload
//         let orderData = {
//             address: data,
//             items: orderItems,
//             amount: getCartAmount(),
//             deliveryFee: deliveryFee
//         };

//         try {
//             const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 // Redirect to Stripe checkout
//                 window.location.replace(response.data.session_url);
//             } else {
//                 toast.error(response.data.message || "Something went wrong");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to place order.");
//         }
//     };

//     return (
//         <form onSubmit={placeOrderHandler} className="flex flex-col lg:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t">
//             {/* Left Side - Delivery Info */}
//             <div className="flex flex-col gap-4 w-full lg:max-w-[480px]">
//                 <div className="text-xl sm:text-2xl my-3">
//                     <Title text1="DELIVERY" text2="INFORMATION" />
//                 </div>
//                 <div className="flex gap-3">
//                     <input required name="firstName" onChange={onChangeHandler} value={data.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First name" />
//                     <input required name="lastName" onChange={onChangeHandler} value={data.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last name" />
//                 </div>
//                 <input required name="email" onChange={onChangeHandler} value={data.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email Address" />
//                 <input required name="street" onChange={onChangeHandler} value={data.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />
//                 <div className="flex gap-3">
//                     <input required name="city" onChange={onChangeHandler} value={data.city} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
//                     <input required name="district" onChange={onChangeHandler} value={data.district} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="District" />
//                 </div>
//                 <input required name="phone" onChange={onChangeHandler} value={data.phone} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="tel" placeholder="Phone" />
//             </div>

//             {/* Right Side - Cart Total & Payment */}
//             <div className="w-full lg:max-w-sm">
//                 <CartTotal />
//                 <div className='w-full mt-8'>
//                     <button type="submit" className='w-full bg-black text-white px-8 py-3 text-sm hover:bg-pink-600 transition'>
//                         PROCEED TO PAYMENT
//                     </button>
//                 </div>
//             </div>
//         </form>
//     );
// };

// export default PlaceOrder;


import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const { getCartAmount, products, cartItems, currency, deliveryFee, token, backendUrl } = useContext(ShopContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        district: "",
        phone: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const placeOrderHandler = async (event) => {
        event.preventDefault();

        let orderItems = [];
        // The 'products' array from context already has all product details, including images.
        products.forEach((product) => {
            if (cartItems[product._id]) {
                Object.entries(cartItems[product._id]).forEach(([size, quantity]) => {
                    if (quantity > 0) {
                        // Create a complete item object, including the image.
                        let itemInfo = {
                            ...product, // This copies all product details (name, price, image, etc.)
                            quantity,
                            size
                        };
                        orderItems.push(itemInfo);
                    }
                });
            }
        });

        if (orderItems.length === 0) {
            return toast.error("Your cart is empty.");
        }

        let orderData = {
            address: data,
            items: orderItems,
            amount: getCartAmount(),
            deliveryFee: deliveryFee
        };

        try {
            const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                window.location.replace(response.data.session_url);
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order.");
        }
    };
    
    // Redirect if cart is empty
    useEffect(() => {
        if (getCartAmount() === 0) {
            navigate('/');
        }
    }, [getCartAmount, navigate]);

    return (
        <form onSubmit={placeOrderHandler} className="flex flex-col lg:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t">
            {/* Left Side - Delivery Info */}
            <div className="flex flex-col gap-4 w-full lg:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1="DELIVERY" text2="INFORMATION" />
                </div>
                <div className="flex gap-3">
                    <input required name="firstName" onChange={onChangeHandler} value={data.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First name" />
                    <input required name="lastName" onChange={onChangeHandler} value={data.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last name" />
                </div>
                <input required name="email" onChange={onChangeHandler} value={data.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email Address" />
                <input required name="street" onChange={onChangeHandler} value={data.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />
                <div className="flex gap-3">
                    <input required name="city" onChange={onChangeHandler} value={data.city} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
                    <input required name="district" onChange={onChangeHandler} value={data.district} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="District" />
                </div>
                <input required name="phone" onChange={onChangeHandler} value={data.phone} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="tel" placeholder="Phone" />
            </div>

            {/* Right Side - Cart Total & Payment */}
            <div className="w-full lg:max-w-sm">
                <CartTotal />
                <div className='w-full mt-8'>
                    <button type="submit" className='w-full bg-black text-white px-8 py-3 text-sm hover:bg-pink-600 transition'>
                        PROCEED TO PAYMENT
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
