import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { backendUrl } = useContext(ShopContext);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const response = await axios.post(`${backendUrl}/api/order/verify`, { success, orderId });
                if (response.data.success) {
                    toast.success("Payment Successful! Your order is confirmed.");
                    navigate("/myorders");
                } else {
                    toast.error("Payment Failed. Please try again.");
                    navigate("/");
                }
            } catch (error) {
                toast.error("An error occurred during payment verification.");
                navigate("/");
            }
        };
        verifyPayment();
    }, [success, orderId, backendUrl, navigate]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-600"></div>
            <p className="ml-4 text-lg">Verifying your payment...</p>
        </div>
    );
};

export default Verify;
