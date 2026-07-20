import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../store/authSlice";
import { API_PRODUCTS, API_CART } from "../config";
import { toast } from 'sonner';
import axios from 'axios';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';


function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_PRODUCTS);
        const data = response.data;
        if (data.success) {
          setProducts(data.products);
        } else {
          toast.error(data.message || 'Failed to fetch products');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post(API_CART, {
        productId,
        quantity: 1,
      }, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        dispatch(setCart(data.cart));
        const prod = products.find((p) => p._id === productId);
        toast.success(`${prod ? prod.name : 'Product'} added to cart.`);
      } else {
        toast.error(data.message || 'Failed to add item to cart');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Connection error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Products</h1>
            <p className="text-slate-500 mt-1">Explore our latest arrivals and tech gadgets</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
                  {user?.role !== 'vendor' && (
                    <button 
                      onClick={() => handleAddToCart(product._id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Products;