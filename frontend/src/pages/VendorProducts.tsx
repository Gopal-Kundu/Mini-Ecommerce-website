import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_PRODUCTS } from '../config';
import { toast } from 'sonner';
import axios from 'axios';
import VendorHeader from '../components/VendorHeader';
import Footer from '../components/Footer';

const VendorProducts = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

    const fetchVendorProducts = async () => {
      try {
        const response = await axios.get(`${API_PRODUCTS}/vendor`, {
          withCredentials: true,
        });
        const data = response.data;
        if (data.success) {
          setProducts(data.products);
        } else {
          toast.error(data.message || 'Failed to fetch your products');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Connection error');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProducts();
  }, [user, navigate]);

  if (!user || user.role !== 'vendor') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <VendorHeader />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Products</h1>
            <p className="text-slate-500 mt-1">Manage and view the items you have listed in the shop</p>
          </div>
          <button
            onClick={() => navigate('/vendor/add-product')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Add New Product
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No products listed</h2>
            <p className="text-slate-500 mb-8">You haven't listed any products for sale yet.</p>
            <button
              onClick={() => navigate('/vendor/add-product')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors"
            >
              List Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <div 
                key={product._id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-xl border border-gray-100 mb-4"
                  />
                  <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
                    {product.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                    {product.description && product.description.split(' ').length > 50
                      ? product.description.split(' ').slice(0, 50).join(' ') + '...'
                      : product.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                  <span className="text-2xl font-black text-slate-900">
                    ₹{product.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default VendorProducts;
