import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setshowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium relative">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-36" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-pink-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        {/* Search */}
        <img
          onClick={() => setshowSearch(true)}
          src={assets.search}
          className="w-5 cursor-pointer"
          alt="Search"
        />

        {/* Login/User Icon with dropdown */}
        <div className="group relative">
          <img
            src={assets.login}
            alt="User-Account"
            onClick={() => !token && navigate('/login')}
            className="w-5 cursor-pointer"
          />

          {/* Dropdown menu */}
          {token && (
            <div className="group-hover:block hidden absolute right-0 pt-4 z-10">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-pink-100 text-gray-500 rounded shadow">
                <p className="cursor-pointer hover:text-black" onClick={() => navigate('/profile')}>My Profile</p>
                <p
                  onClick={() => navigate('/myorders')}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p
                  onClick={logout}
                  className="cursor-pointer hover:text-black"
                >
                  Log Out
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cart} alt="Cart" className="w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] w-3 text-center leading-3 bg-black text-white aspect-square rounded-full text-[6px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`absolute top-10 left-0 right-0 bg-white transition-all duration-300 overflow-hidden ${
          visible ? 'h-auto py-4' : 'h-0'
        }`}
      >
        <div className="flex flex-col text-black">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-6 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.back} alt="Back" />
            <span>Back</span>
          </div>
          <NavLink
            to="/"
            className="py-2 pl-6 hover:bg-pink-200"
            onClick={() => setVisible(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/collection"
            className="py-2 pl-6 hover:bg-pink-200"
            onClick={() => setVisible(false)}
          >
            Collection
          </NavLink>
          <NavLink
            to="/about"
            className="py-2 pl-6 hover:bg-pink-200"
            onClick={() => setVisible(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="py-2 pl-6 hover:bg-pink-200"
            onClick={() => setVisible(false)}
          >
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
