import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_ORDERS } from '../config';
import { toast } from 'sonner';
import axios from 'axios';
import VendorHeader from '../components/VendorHeader';
import Footer from '../components/Footer';

const VendorOrders = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchVendorOrders = async () => {
    try {
      const response = await axios.get(`${API_ORDERS}/vendor`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message || 'Failed to fetch received orders');
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
    if (user.role !== 'vendor') {
      toast.error('Access denied. Vendors only.');
      navigate('/products');
      return;
    }

    fetchVendorOrders();
  }, [user, navigate]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await axios.put(`${API_ORDERS}/vendor/${orderId}`, {
        status: newStatus,
      }, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        toast.success('Order status updated successfully!');
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Connection error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user || user.role !== 'vendor') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <VendorHeader />

      {/* Main Content */}
      <div className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Orders Received</h1>
          <p className="text-slate-500 mt-1">Monitor, ship, and manage order fulfillments for your listed products</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📥</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders received yet</h2>
            <p className="text-slate-500">When customers purchase your listed items, they will appear here.</p>
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

              return (
                <div 
                  key={order._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Order Header / Metadata */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order ID</p>
                      <p className="text-sm font-semibold text-slate-800">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date Placed</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Value</p>
                      <p className="text-sm font-bold text-indigo-600">₹{orderTotal}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-2">Status:</span>
                      <select
                        disabled={updatingId === order._id}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold rounded-lg border px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                          order.status === 'Delivered' 
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : order.status === 'Shipped'
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : order.status === 'Cancelled'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Information & Shipping Address */}
                  <div className="p-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Details</h4>
                      <p className="text-sm font-semibold text-slate-900">{order.customer?.name || 'Guest'}</p>
                      <p className="text-xs text-slate-500">{order.customer?.email || 'No email'}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shipping Address</h4>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                        {order.address}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
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

export default VendorOrders;
