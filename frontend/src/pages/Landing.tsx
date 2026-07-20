import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';


function Landing() {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

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