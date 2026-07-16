import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    cart: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload && action.payload.cart) {
        state.cart = action.payload.cart;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.cart = [];
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const { setUser, setLoading, logoutUser, setCart } = authSlice.actions;
export default authSlice.reducer;
