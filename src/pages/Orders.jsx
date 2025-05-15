import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const Orders = () => {
  const { products, currency } = useContext(ShopContext);

  return (
    <div className="border-t pt-16 px-4 sm:px-10">
      <div className="text-2xl mb-6">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {products?.length > 0 ? (
        products.slice(1, 4).map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 mb-4 shadow-sm rounded-md border"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20 object-cover rounded-md"
                  src={item.image[0]}
                  alt={item.name}
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-base text-gray-700">
                    <p className="text-lg">{currency}{item.price}</p>
                    <p>Quantity: 1</p>
                    <p>Size: M</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Date: <span className="text-gray-400">25 April, 2025</span>
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-end md:justify-between mt-4 md:mt-0">
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <div className="min-w-2 h-2 rounded-full bg-green-500"></div>
                  <p>Ready To Ship</p>
                </div>
                <button className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm mt-6">No orders placed yet.</p>
      )}
    </div>
  );
};

export default Orders;
