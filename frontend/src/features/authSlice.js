import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
let user = null;

try {
  const storedUser = localStorage.getItem('user');
  user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
} catch {
  user = null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user,
    token: token || null,
    isAuthenticated: !!token && !!user,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
