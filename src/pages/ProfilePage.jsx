import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets'; // Assuming you have a back arrow icon

const ProfilePage = () => {
    const { user, token, logout, backendUrl, navigate, setToken, loadUserFromToken } = useContext(ShopContext);

    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
    });

    // Populate form with user data when the component loads
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (formData.newPassword && !formData.currentPassword) {
            return toast.error("Please enter your current password to set a new one.");
        }

        try {
            const response = await axios.put(`${backendUrl}/api/user/update`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const newToken = response.data.token;
                // Update the session with the new token containing updated user info
                localStorage.setItem('token', newToken);
                setToken(newToken);
                loadUserFromToken(newToken);

                toast.success("Profile updated successfully!");
                setIsEditing(false);
                // Clear password fields after submission
                setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete(`${backendUrl}/api/user/delete`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Account deleted successfully.");
                logout(); // Log out and clear session
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account.");
            setShowDeleteConfirm(false);
        }
    };

    if (!user) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    return (
        <>
            <div className="flex flex-col items-center w-[90%] sm:max-w-xl m-auto mt-14 mb-20 gap-4 text-gray-800">
                {/* Header */}
                <div className="w-full flex items-center justify-between mb-6">
                    <img 
                        src={assets.arrow_left} // Make sure this asset exists
                        alt="Back" 
                        onClick={() => navigate(-1)}
                        className="w-6 h-6 cursor-pointer"
                    />
                    <div className="inline-flex items-center gap-2">
                        <p className="prata-regular text-3xl">My Profile</p>
                        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
                    </div>
                    <div className="w-6"></div> {/* Spacer */}
                </div>

                {/* Profile Form */}
                <form onSubmit={handleUpdateSubmit} className="w-full flex flex-col gap-5">
                    <div>
                        <label className="text-sm">Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            type="text"
                            className={`w-full px-3 py-2 mt-1 border ${isEditing ? 'border-gray-800' : 'border-gray-300 bg-gray-100'}`}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div>
                        <label className="text-sm">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            type="email"
                            className={`w-full px-3 py-2 mt-1 border ${isEditing ? 'border-gray-800' : 'border-gray-300 bg-gray-100'}`}
                            readOnly={!isEditing}
                        />
                    </div>
                    
                    {isEditing && (
                        <>
                            <hr className="my-2"/>
                            <p className="text-center text-sm text-gray-500">To change your password, enter your current and new password below.</p>
                            <div>
                                <label className="text-sm">Current Password</label>
                                <input
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    type="password"
                                    className="w-full px-3 py-2 mt-1 border border-gray-800"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="text-sm">New Password</label>
                                <input
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    type="password"
                                    className="w-full px-3 py-2 mt-1 border border-gray-800"
                                    placeholder="Enter new password (optional)"
                                />
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-4">
                        {isEditing ? (
                            <>
                                <button type="submit" className="flex-1 bg-black text-white py-2 hover:bg-pink-600 transition-all">
                                    Save Changes
                                </button>
                                <button type="button" onClick={() => { setIsEditing(false); setFormData({name: user.name, email: user.email, currentPassword: '', newPassword: ''}) }} className="flex-1 bg-gray-200 text-black py-2">
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button type="button" onClick={() => setIsEditing(true)} className="w-full bg-black text-white py-2 hover:bg-pink-600 transition-all">
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>

                {/* Other Actions */}
                <div className="w-full mt-10 flex flex-col gap-4">
                    <hr/>
                    <button onClick={logout} className="w-full border border-gray-800 text-black py-2">
                        Logout
                    </button>
                    <button onClick={() => setShowDeleteConfirm(true)} className="w-full bg-red-600 text-white py-2">
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                        <p className="mb-6 text-gray-600">This action is irreversible. All your data will be permanently deleted.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-6 py-2 rounded">
                                Confirm Delete
                            </button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-200 text-black px-6 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfilePage;

