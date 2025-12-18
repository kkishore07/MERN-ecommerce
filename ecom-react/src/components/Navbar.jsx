import React, { useContext } from "react";
import { Link } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import { getUserFromToken } from "../utils/auth";

const Navbar = () => {
  const { cartCount } = useContext(GlobalContext);
  const user = getUserFromToken(sessionStorage.getItem("token"));
  const storedUsername = sessionStorage.getItem("username");
  const displayName = storedUsername || user?.name || user?.email || "";
  return (
    <nav className="bg-slate-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white">
              Shop<span className="text-blue-500">Easy</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Home 🏠
            </Link>
            <Link
              to="/products"
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Products 📱
            </Link>
            <Link
              to="/orders"
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Orders 🛍️
            </Link>
            <Link
              to="/cart"
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Cart 🛒{cartCount}
            </Link>
            {user || storedUsername ? (
              <div className="flex items-center space-x-2">
                {displayName && (
                  <span className="text-gray-300 font-semibold px-2">
                    👤 {displayName}
                  </span>
                )}
                <button
                  onClick={() => {
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  className="text-sm text-red-400 hover:text-red-600 border border-red-400 rounded px-2 py-1 ml-1 transition-colors duration-200"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Login ➜
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
