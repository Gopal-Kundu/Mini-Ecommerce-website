import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCart, logoutUser } from '../store/authSlice';
import { API_CART, API_URL } from '../config';
import { toast } from 'sonner';
import axios from 'axios';
import Footer from '../components/Footer';


const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state: any) => state.auth);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      dispatch(logoutUser());
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) return;
    setUpdating(true);
    try {
      const response = await axios.put(`${API_CART}/${productId}`, { quantity }, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        dispatch(setCart(data.cart));
      } else {
        toast.error(data.message || 'Failed to update quantity');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Connection error');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId: string) => {
    setUpdating(true);
    try {
      const response = await axios.delete(`${API_CART}/${productId}`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        dispatch(setCart(data.cart));
        toast.success('Item removed from cart');
      } else {
        toast.error(data.message || 'Failed to remove item');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Connection error');
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = async () => {
    setUpdating(true);
    try {
      const response = await axios.delete(API_CART, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        dispatch(setCart([]));
        toast.success('Order placed successfully!');
      } else {
        toast.error(data.message || 'Checkout failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Connection error');
    } finally {
      setUpdating(false);
    }
  };

  const subtotal = cart.reduce((total: number, item: any) => {
    if (item.product) {
      return total + item.product.price * item.quantity;
    }
    return total;
  }, 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-sm border-b border-gray-100">
        <h1 
          className="text-2xl font-extrabold text-indigo-600 tracking-tight cursor-pointer" 
          onClick={() => navigate("/")}
        >
          Mini-Ecommerce
        </h1>

        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate("/")} 
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={() => navigate("/products")} 
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer"
          >
            Shop
          </button>
          <button 
            onClick={() => navigate("/cart")} 
            className="text-indigo-600 font-semibold transition-colors cursor-pointer relative"
          >
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cart.reduce((sum: number, item: any) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
            <span className="text-gray-700 font-medium">
              Hi, <span className="text-indigo-600 font-semibold">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Add items to your cart to start shopping.</p>
            <Link
              to="/products"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors duration-200"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item: any) => {
                if (!item.product) return null;
                return (
                  <div 
                    key={item.product._id}
                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6"
                  >
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-24 h-24 object-cover rounded-xl border border-gray-100"
                    />

                    <div className="flex-1 text-center sm:text-left">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">
                        {item.product.category}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900">{item.product.name}</h2>
                      <p className="text-slate-500 text-sm mt-1">
                        {item.product.description && item.product.description.split(' ').length > 50
                          ? item.product.description.split(' ').slice(0, 50).join(' ') + '...'
                          : item.product.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg font-bold text-slate-900">₹{item.product.price}</span>
                      
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          disabled={updating || item.quantity <= 1}
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors font-bold"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-slate-900 font-semibold">{item.quantity}</span>
                        <button
                          disabled={updating}
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        disabled={updating}
                        onClick={() => removeItem(item.product._id)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold mt-2 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit space-y-6">
              <h2 className="text-xl font-bold text-slate-950 pb-4 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between text-slate-900 font-bold">
                <span>Total Amount</span>
                <span className="text-xl text-indigo-600">₹{subtotal}</span>
              </div>

              <button
                disabled={updating}
                onClick={handleCheckout}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 transition-all duration-200 text-center cursor-pointer"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Cart;
