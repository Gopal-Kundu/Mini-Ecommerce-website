import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { API_PRODUCTS, API_URL } from '../config';
import { toast } from 'sonner';
import axios from 'axios';
import Footer from '../components/Footer';


const VendorAddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'vendor') {
      toast.error('Access denied. Vendors only.');
      navigate('/products');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description || !category || !image) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(API_PRODUCTS, {
        name,
        price: Number(price),
        description,
        category,
        image,
      }, {
        withCredentials: true,
      });

      const data = response.data;
      if (data.success) {
        toast.success('Product created successfully!');
        setName('');
        setPrice('');
        setDescription('');
        setCategory('');
        setImage('');
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to create product');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'vendor') return null;

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
            onClick={() => navigate("/vendor/add-product")} 
            className="text-indigo-600 font-semibold transition-colors cursor-pointer"
          >
            Vendor Panel
          </button>

          <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
            <span className="text-gray-700 font-medium">
              Hi, <span className="text-indigo-600 font-semibold">{user.name}</span> (Vendor)
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
      <div className="flex-1 flex justify-center items-center p-10">
        <div className="w-full max-w-xl bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Add New Product</h2>
          <p className="text-slate-500 text-sm mb-8">List a new product in the marketplace store.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Wireless Noise Cancelling Headphones"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="2999"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Electronics"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-28 resize-none"
                placeholder="Experience immersive crystal-clear sound with our flagship active noise cancelling wireless headphones..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Product Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="https://images.unsplash.com/photo-..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer"
            >
              {submitting ? 'Creating Product...' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default VendorAddProduct;
