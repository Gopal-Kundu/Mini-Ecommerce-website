import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { API_ORDERS, API_URL } from '../config';
import { toast } from 'sonner';
import axios from 'axios';
import Footer from '../components/Footer';

const TrackOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state: any) => state.auth);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      const response = await axios.get(`${API_ORDERS}/my-orders`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message || 'Failed to fetch your orders');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyOrders();
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

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0; // Cancelled or other
    }
  };

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
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer relative"
          >
            Cart
            {cart && cart.length > 0 && (
              <span className="absolute -top-2 -right-3.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cart.reduce((sum: number, item: any) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
          <button 
            onClick={() => navigate("/orders/track")} 
            className="text-indigo-600 font-semibold transition-colors cursor-pointer"
          >
            Track Orders
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
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Track Your Orders</h1>
          <p className="text-slate-500 mt-1">Check shipment status and expected delivery dates for your items</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders placed yet</h2>
            <p className="text-slate-500 mb-8">You haven't bought anything from the marketplace store yet.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Browse Shop
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order: any) => {
              const orderTotal = order.items.reduce((total: number, item: any) => {
                if (item.product) {
                  return total + item.product.price * item.quantity;
                }
                return total;
              }, 0);

              const currentStep = getStatusStep(order.status);

              return (
                <div 
                  key={order._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order ID</p>
                      <p className="text-sm font-semibold text-slate-800">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order Date</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Seller Vendor</p>
                      <p className="text-sm font-semibold text-slate-800">{order.vendor?.name || 'Store Seller'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Value</p>
                      <p className="text-sm font-bold text-indigo-600">₹{orderTotal}</p>
                    </div>
                  </div>

                  {/* Delivery Estimate */}
                  <div className="px-6 py-4 bg-indigo-50/50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-lg">🚚</span>
                      <span>Expected Delivery Date:</span>
                      <span className="text-indigo-600 font-bold">
                        {new Date(order.estimatedDeliveryDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                      Delivery in 1 week
                    </span>
                  </div>

                  {/* Order Progress Steps */}
                  {order.status === 'Cancelled' ? (
                    <div className="p-6 bg-red-50/50 text-center">
                      <span className="text-red-600 font-bold text-sm">❌ Order has been Cancelled</span>
                    </div>
                  ) : (
                    <div className="p-8 border-b border-gray-100 bg-white">
                      <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto">
                        {/* Background line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 z-0"></div>
                        {/* Progress line */}
                        <div 
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-500"
                          style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                        ></div>

                        {/* Step 1: Placed */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                            currentStep >= 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-gray-100 text-gray-400'
                          }`}>
                            ✓
                          </div>
                          <span className={`text-xs font-bold mt-2 ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>Placed</span>
                        </div>

                        {/* Step 2: Shipped */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                            currentStep >= 2 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {currentStep >= 2 ? '✓' : '2'}
                          </div>
                          <span className={`text-xs font-bold mt-2 ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>Shipped</span>
                        </div>

                        {/* Step 3: Delivered */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                            currentStep >= 3 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {currentStep >= 3 ? '✓' : '3'}
                          </div>
                          <span className={`text-xs font-bold mt-2 ${currentStep >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>Delivered</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items list */}
                  <div className="divide-y divide-gray-50 bg-white">
                    {order.items.map((item: any, idx: number) => {
                      if (!item.product) return null;
                      return (
                        <div 
                          key={idx}
                          className="p-6 flex flex-col sm:flex-row items-center gap-6"
                        >
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                          />
                          <div className="flex-1 text-center sm:text-left">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                              {item.product.category}
                            </span>
                            <h5 className="text-sm font-bold text-slate-900">{item.product.name}</h5>
                            <p className="text-xs text-slate-400 mt-0.5">Price: ₹{item.product.price}</p>
                          </div>
                          <div className="text-center sm:text-right">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quantity</p>
                            <p className="text-sm font-bold text-slate-800">{item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrders;
