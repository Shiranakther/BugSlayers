// //Cart Total Component
// // This component displays the total amount of the cart including shipping charges.
// import React, { useContext } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from './Title';

// const CartTotal = () => {

//     const {currency, deliveryFee, getCartAmount} = useContext(ShopContext);
//   return (
//     <div className='w-full'>
//         <div className='text-2xl'>
//             <Title text1={'Cart'} text2={'Total'} />
//         </div>
//         <div className='flex flex-col gap-2 mt-2 text-sm'>
//             <div className='flex justify-between'>
//                 <p>Sub Total</p>
//                 <p>{currency} {getCartAmount()}.00</p>
//             </div>
//             <hr />

//             <div className='flex justify-between'>
//                 <p>Shipping Charges</p>
//                 <p>{currency}{deliveryFee}.00</p>
//             </div>
//             <hr />
//             <div className='flex justify-between font-bold'>
//                 <p>Total</p>
//                 <p>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + deliveryFee}.00</p>

//             </div>
//         </div>
      
//     </div>
//   )
// }

// export default CartTotal

import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
    const { currency, deliveryFee, getCartAmount } = useContext(ShopContext);

    // Call the function and ensure subTotal is always a number, defaulting to 0.
    const subTotal = getCartAmount() || 0;
    const total = subTotal > 0 ? subTotal + deliveryFee : 0;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'Cart'} text2={'Total'} />
            </div>
            <div className='flex flex-col gap-3 mt-4 text-gray-700'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    {/* Use .toFixed(2) for proper currency formatting */}
                    <p>{currency}{subTotal.toFixed(2)}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currency}{subTotal > 0 ? deliveryFee.toFixed(2) : (0).toFixed(2)}</p>
                </div>
                <hr />
                <div className='flex justify-between font-bold text-lg'>
                    <p>Total</p>
                    <p>{currency}{total.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;


