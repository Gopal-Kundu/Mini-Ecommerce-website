import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { API_URL } from '../config';
import axios from 'axios';

const VendorHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

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

  const isActive = (path: string) => location.pathname === path;

  if (!user || user.role !== 'vendor') return null;

  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-sm border-b border-gray-100 font-sans">
      <div className="flex items-center space-x-8">
        <h1 
          className="text-2xl font-extrabold text-indigo-600 tracking-tight cursor-pointer" 
          onClick={() => navigate("/")}
        >
          Mini-Ecommerce
        </h1>
        <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md">
          Vendor Panel
        </span>
      </div>

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
  );
};

export default VendorHeader;
