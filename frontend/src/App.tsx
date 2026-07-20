import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector, Provider } from "react-redux";
import Landing from "./pages/Landing";
import Products from "./pages/products";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import VendorAddProduct from "./pages/VendorAddProduct";
import VendorProducts from "./pages/VendorProducts";
import VendorOrders from "./pages/VendorOrders";
import TrackOrders from "./pages/TrackOrders";
import { store } from "./store";

import { setUser, setLoading } from "./store/authSlice";
import { API_URL } from "./config";
import axios from 'axios';

import { Toaster } from 'sonner';


function AppContent() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/me`, {
          withCredentials: true,
        });
        const data = response.data;
        if (data.success) {
          dispatch(setUser(data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/vendor/add-product" element={<VendorAddProduct />} />
        <Route path="/vendor/products" element={<VendorProducts />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/orders/track" element={<TrackOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-right" richColors />
      <AppContent />
    </Provider>
  );
}

export default App;