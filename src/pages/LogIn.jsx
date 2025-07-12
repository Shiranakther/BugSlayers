import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const LogIn = () => {
    // --- Get the login and register functions from the context ---
    const { login, register } = useContext(ShopContext);

    const [currentState, setCurrentState] = useState('Login'); // or "Sign Up"
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // A single handler to update the form data state
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // The handler now simply calls the functions from the context
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (currentState === 'Sign Up') {
            await register(formData.name, formData.email, formData.password);
        } else {
            await login(formData.email, formData.password);
        }
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
        >
            <div className="inline-flex items-center gap-2 mt-10">
                <p className="prata-regular text-3xl">{currentState}</p>
                <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
            </div>

            {/* Name field only for Sign Up */}
            {currentState === 'Sign Up' && (
                <input
                    name="name"
                    onChange={onChangeHandler}
                    value={formData.name}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-800"
                    placeholder="Name"
                    required
                />
            )}

            {/* Email field */}
            <input
                name="email"
                onChange={onChangeHandler}
                value={formData.email}
                type="email"
                className="w-full px-3 py-2 border border-gray-800"
                placeholder="Email"
                required
            />

            {/* Password field */}
            <input
                name="password"
                onChange={onChangeHandler}
                value={formData.password}
                type="password"
                className="w-full px-3 py-2 border border-gray-800"
                placeholder="Password"
                required
            />

            {/* Bottom row: forgot password + toggle */}
            <div className="w-full flex justify-between text-sm mt-[-8px]">
                <p className="cursor-pointer">Forgot your password?</p>
                {currentState === 'Login' ? (
                    <p
                        onClick={() => setCurrentState('Sign Up')}
                        className="cursor-pointer text-pink-600 hover:underline"
                    >
                        Create Account
                    </p>
                ) : (
                    <p
                        onClick={() => setCurrentState('Login')}
                        className="cursor-pointer text-pink-600 hover:underline"
                    >
                        Login Here
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button className="bg-black text-white font-light px-8 py-2 mt-4 hover:bg-pink-600 transition-all">
                {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
            </button>
        </form>
    );
};

export default LogIn;