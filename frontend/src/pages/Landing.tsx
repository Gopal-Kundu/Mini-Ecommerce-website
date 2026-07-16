import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { API_URL } from "../config";
import axios from 'axios';
import Footer from '../components/Footer';


function Landing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state: any) => state.auth);

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
            className="text-indigo-600 font-semibold transition-colors cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={() => navigate("/products")} 
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer"
          >
            Shop
          </button>
          {user && user.role === 'vendor' && (
            <button 
              onClick={() => navigate("/vendor/add-product")} 
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer"
            >
              Vendor Panel
            </button>
          )}
          {user && user.role === 'user' && (
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
          )}

          {user ? (
            <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
              <span className="text-gray-700 font-medium">
                Hi, <span className="text-indigo-600 font-semibold">{user.name}</span>{user.role === 'vendor' && <span className="text-slate-400 text-xs ml-1">(Vendor)</span>}
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
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-10 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="text-center max-w-2xl">
          <h2 className="text-5xl font-black text-slate-950 mb-5 leading-tight tracking-tight">
            Welcome to <span className="text-indigo-600">Mini-Ecommerce</span>
          </h2>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Discover a curated collection of high-quality products at accessible prices. Experience seamless shopping designed around you.
          </p>

          <div className="flex justify-center gap-4">
            {(!user || user.role === 'user') && (
              <button
                onClick={() => navigate("/products")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl text-lg shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Shop Now
              </button>
            )}
            {user && user.role === 'vendor' && (
              <>
                <button
                  onClick={() => navigate("/vendor/add-product")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl text-lg shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  Sell Items
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-8 py-3.5 rounded-xl text-lg transition-all duration-200 cursor-pointer"
                >
                  Browse Shop
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={() => navigate("/signup")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-8 py-3.5 rounded-xl text-lg transition-all duration-200 cursor-pointer"
              >
                Be a Vendor
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Landing;