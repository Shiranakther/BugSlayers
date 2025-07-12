import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import Title from '../components/Title';
import { assets } from '../assets/assets'; // Assuming you have a parcel icon

const MyOrders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (token) {
                try {
                    const response = await axios.get(`${backendUrl}/api/order/userorders`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        setOrders(response.data.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch orders', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // If no token, stop loading
            }
        };

        fetchOrders();
    }, [token, backendUrl]);

    if (loading) {
        return <div className="text-center p-10">Loading your orders...</div>;
    }

    return (
        <div className="border-t pt-14 min-h-[60vh] px-4 sm:px-10">
            <div className='text-2xl mb-6'>
                <Title text1={'My'} text2={'Orders'} />
            </div>
            <div className="flex flex-col gap-5">
                {orders.length === 0 ? (
                    <p className="text-center text-gray-600">You have no orders yet.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="border p-4 rounded-lg grid sm:grid-cols-[auto_1fr_auto] items-center gap-4 text-sm">
                            {/* Use the image from the first item in the order */}
                            <img 
                                src={order.items[0].image[0]} 
                                alt="Order item" 
                                className="w-12 h-12 object-cover rounded-md"
                            />
                            
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {order.items.map((item, index) => (
                                        <span key={index}>
                                            {item.name} x {item.quantity}{index === order.items.length - 1 ? '' : ', '}
                                        </span>
                                    ))}
                                </p>
                                <p className="text-gray-500">Items: {order.items.length}</p>
                                <p className="text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-lg">{currency}{(order.amount).toFixed(2)}</p>
                                <p className="flex items-center justify-end gap-2 mt-1">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span> 
                                    <span>{order.status}</span>
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;
