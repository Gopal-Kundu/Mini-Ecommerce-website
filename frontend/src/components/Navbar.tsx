import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { API_URL } from '../config';
import axios from 'axios';
import { Menu, X, ShoppingCart, Package, PlusCircle, LogOut, Store, Home, ClipboardList } from 'lucide-react';

interface NavbarProps {
  isVendorMode?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isVendorMode = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state: any) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const isVendorRoute = isVendorMode || location.pathname.startsWith('/vendor');

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      dispatch(logoutUser());
      setIsOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const totalCartCount = cart && cart.length > 0
    ? cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
    : 0;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { navigate("/"); closeMenu(); }}>
            <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">
              Mini-Ecommerce
            </span>
            {(isVendorRoute || user?.role === 'vendor') && (
              <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-100 hidden sm:inline-block">
                Vendor Panel
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("/")}
              className={`font-medium transition-colors cursor-pointer ${isActive("/") ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"}`}
            >
              Home
            </button>
            {user?.role !== 'vendor' && (
              <button
                onClick={() => navigate("/products")}
                className={`font-medium transition-colors cursor-pointer ${isActive("/products") ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"}`}
              >
                Shop
              </button>
            )}

            {/* Vendor Links if logged in as Vendor */}
            {user?.role === 'vendor' ? (
              <>
                <div className="h-4 w-px bg-gray-200"></div>
                <button
                  onClick={() => navigate("/vendor/add-product")}
                  className={`font-semibold transition-colors cursor-pointer ${isActive("/vendor/add-product") ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"}`}
                >
                  Add Product
                </button>
                <button
                  onClick={() => navigate("/vendor/products")}
                  className={`font-semibold transition-colors cursor-pointer ${isActive("/vendor/products") ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"}`}
                >
                  My Products
                </button>
                <button
                  onClick={() => navigate("/vendor/orders")}
                  className={`font-semibold transition-colors cursor-pointer ${isActive("/vendor/orders") ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"}`}
                >
                  Orders Received
                </button>
              </>
            ) : (
              <>
                {user && user.role === 'user' && (
                  <>
                    <button
                      onClick={() => navigate("/cart")}
                      className={`font-medium transition-colors cursor-pointer relative ${isActive("/cart") ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"}`}
                    >
                      Cart
                      {totalCartCount > 0 && (
                        <span className="absolute -top-2 -right-3.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {totalCartCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => navigate("/orders/track")}
                      className={`font-medium transition-colors cursor-pointer ${isActive("/orders/track") ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"}`}
                    >
                      Track Orders
                    </button>
                  </>
                )}
              </>
            )}

            {/* User Account / Auth Actions */}
            {user ? (
              <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                <span className="text-gray-700 font-medium text-sm">
                  Hi, <span className="text-indigo-600 font-semibold">{user.name}</span>
                  {user.role === 'vendor' && <span className="text-slate-400 text-xs ml-1">(Vendor)</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Menu className={`w-6 h-6 absolute transition-all duration-300 transform ${isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
                <X className={`w-6 h-6 absolute transition-all duration-300 transform ${isOpen ? 'opacity-100 rotate-0 scale-100 text-indigo-600' : 'opacity-0 -rotate-90 scale-75'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-gray-100 shadow-lg' : 'grid-rows-[0fr] opacity-0 border-t-0 shadow-none'
        }`}
      >
        <div className="overflow-hidden bg-white">
          <div className="px-4 pt-3 pb-6 space-y-3">
            {(isVendorRoute || user?.role === 'vendor') && (
              <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md w-fit mb-2">
                Vendor Panel
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => { navigate("/"); closeMenu(); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-base text-left transition-colors ${
                  isActive("/") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              {user?.role !== 'vendor' && (
                <button
                  onClick={() => { navigate("/products"); closeMenu(); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-base text-left transition-colors ${
                    isActive("/products") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span>Shop</span>
                </button>
              )}

              {user?.role === 'vendor' ? (
                <>
                  <div className="pt-2 border-t border-gray-100 text-xs font-bold text-slate-400 uppercase tracking-wider px-3">
                    Vendor Controls
                  </div>
                  <button
                    onClick={() => { navigate("/vendor/add-product"); closeMenu(); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-base text-left transition-colors ${
                      isActive("/vendor/add-product") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Add Product</span>
                  </button>

                  <button
                    onClick={() => { navigate("/vendor/products"); closeMenu(); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-base text-left transition-colors ${
                      isActive("/vendor/products") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span>My Products</span>
                  </button>

                  <button
                    onClick={() => { navigate("/vendor/orders"); closeMenu(); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-base text-left transition-colors ${
                      isActive("/vendor/orders") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ClipboardList className="w-5 h-5" />
                    <span>Orders Received</span>
                  </button>
                </>
              ) : (
                <>
                  {user && user.role === 'user' && (
                    <>
                      <button
                        onClick={() => { navigate("/cart"); closeMenu(); }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-base text-left transition-colors ${
                          isActive("/cart") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="w-5 h-5" />
                          <span>Cart</span>
                        </div>
                        {totalCartCount > 0 && (
                          <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {totalCartCount} items
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => { navigate("/orders/track"); closeMenu(); }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-base text-left transition-colors ${
                          isActive("/orders/track") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <ClipboardList className="w-5 h-5" />
                        <span>Track Orders</span>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* User Auth Section Mobile */}
            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <div className="space-y-3 px-1">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Logged in as</span>
                      <span className="text-sm font-bold text-slate-900">
                        {user.name} {user.role === 'vendor' && <span className="text-indigo-600 text-xs font-semibold">(Vendor)</span>}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => { navigate("/login"); closeMenu(); }}
                    className="w-full text-center py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { navigate("/signup"); closeMenu(); }}
                    className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
