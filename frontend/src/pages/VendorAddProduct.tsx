import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_PRODUCTS } from '../config';
import { toast } from 'sonner';
import axios from 'axios';
import Footer from '../components/Footer';
import VendorHeader from '../components/VendorHeader';



const VendorAddProduct = () => {
  const navigate = useNavigate();
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
      <VendorHeader />

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-6 md:p-10">
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
