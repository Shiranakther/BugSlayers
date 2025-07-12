// //Cart Total Component
// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from '../components/Title'
// import { assets } from '../assets/assets';
// import CartTotal from '../components/CartTotal';

// const Cart = () => {

//   const {products, cartItems, currency, updateQuantity, navigate } = useContext(ShopContext);
//   const [cartData, setcartData] = useState([]);

//   useEffect(() => {
//     const tempData = [];
//     for(const items in cartItems){
//       for(const item in cartItems[items]){
//         if (cartItems[items][item]> 0) {
//           tempData.push({
//             _id : items,
//             size : item,
//             quantity : cartItems[items][item]
//           })         
//         }
//       }
//     }
//     // Set the cart data state
//     setcartData(tempData);
//   },[cartItems])

//   return (
//     <div className='border-t pt-14'>
//       <div className='text-2xl mb-3'>
//         <Title text1={'Cart'} text2={'Items'}/>
//       </div>

//       <div>
//         {
//           cartData.map((item,index)=>{

//             const productData = products.find((products)=> products._id === item._id);

//             return (
//               <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols[4fr_2fr_0.5fr] items-center gap-4'>
//                 <div className='flex items-start gap-6'>
//                   <img className='w-16 sm:w-20' src={productData.image[0]} />
//                   <div>
//                     <p className='text-xs sm:text-lg font-medium '>{productData.name}</p>
//                     <div className='flex items-center gap-5 mt-2'>
//                       <p>{currency}{productData.price}</p>
//                       <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <input onChange={(e)=> e.target.value === '' || e.target.value === 0 ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
//                 <img onClick={()=>updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer ' src={assets.bin_icon}  />
//               </div>
//             )
//           })
//         }
//       </div>

//       <div className='flex justify-end my-20'>
//         <div className='w-full sm:w-[450px]'>
//           <CartTotal/>
//           <div className='w-full text-end'>
//             <button onClick={()=> navigate('/placeOrder')} className='py-3 px-8 my-8 bg-black text-white hover:bg-pink-500 font-medium text-sm'>PROCEED TO CHECKOUT</button>
//           </div>
//         </div>
//       </div>
      
//     </div>
//   )
// }

// export default Cart

import React, { useContext, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal'; // The recreated component from above

const Cart = () => {
    const { products, cartItems, currency, updateQuantity, navigate, getCartCount } = useContext(ShopContext);

    // Create a product map for efficient lookups. This is much faster than using .find() inside a loop.
    const productMap = useMemo(() => {
        return products.reduce((map, product) => {
            map[product._id] = product;
            return map;
        }, {});
    }, [products]);

    // Transform the cartItems object into a flat array for rendering.
    // This is done directly in the render logic to avoid extra state and useEffect.
    const cartData = Object.entries(cartItems).flatMap(([itemId, sizes]) =>
        Object.entries(sizes).map(([size, quantity]) => {
            if (quantity > 0) {
                return {
                    itemId,
                    size,
                    quantity,
                    product: productMap[itemId] // Attach product data directly
                };
            }
            return null;
        }).filter(Boolean) // Filter out any null entries
    );

    // Handle the "Empty Cart" case
    if (getCartCount() === 0) {
        return (
            <div className="border-t pt-14 flex flex-col items-center justify-center min-h-[50vh]">
                <Title text1={'Your Cart'} text2={'is Empty'} />
                <p className="text-gray-600 mt-4">Looks like you haven't added anything to your cart yet.</p>
                <button 
                    onClick={() => navigate('/')} 
                    className='py-3 px-8 my-8 bg-black text-white hover:bg-pink-500 font-medium text-sm'
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-3'>
                <Title text1={'Shopping'} text2={'Cart'} />
            </div>

            {/* Cart Items Grid */}
            <div className="border-t border-b divide-y">
                {cartData.map(item => {
                    // If product data for an item doesn't exist for some reason, skip rendering it.
                    if (!item.product) return null;

                    return (
                        <div key={`${item.itemId}-${item.size}`} className='py-4 text-gray-700 grid grid-cols-[1fr_auto_auto] sm:grid-cols-[4fr_1fr_auto_auto] items-center gap-4'>
                            {/* Product Info */}
                            <div className='flex items-start gap-4 sm:gap-6'>
                                <img className='w-16 sm:w-20' src={item.product.image[0]} alt={item.product.name} />
                                <div>
                                    <p className='text-sm sm:text-base font-medium'>{item.product.name}</p>
                                    <div className='flex items-center gap-4 mt-2'>
                                        <p className="text-sm">{currency}{item.product.price.toFixed(2)}</p>
                                        <p className='px-2 py-1 border bg-slate-50 text-xs'>{item.size}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Price per item */}
                            <p className="hidden sm:block text-center">{currency}{(item.product.price * item.quantity).toFixed(2)}</p>

                            {/* Quantity Input */}
                            <input
                                value={item.quantity}
                                onChange={(e) => {
                                    const newQuantity = Number(e.target.value);
                                    // Prevent non-numeric or values less than 1
                                    if (newQuantity >= 1) {
                                        updateQuantity(item.itemId, item.size, newQuantity);
                                    }
                                }}
                                className='border w-14 text-center px-1 py-1'
                                type="number"
                                min={1}
                            />

                            {/* Remove Button */}
                            <img
                                onClick={() => updateQuantity(item.itemId, item.size, 0)} // Assuming 0 quantity removes the item
                                className='w-4 cursor-pointer justify-self-center'
                                src={assets.bin_icon}
                                alt="Remove"
                            />
                        </div>
                    );
                })}
            </div>

            {/* Cart Total and Checkout */}
            <div className='flex justify-end my-20'>
                <div className='w-full sm:w-[450px]'>
                    <CartTotal />
                    <div className='w-full text-end'>
                        <button onClick={() => navigate('/placeOrder')} className='py-3 px-8 my-8 bg-black text-white hover:bg-pink-500 font-medium text-sm'>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

