import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getToken, clearAuthStorage, setToken, setUser, getUser } from '../../utils/tokenHelper';
import { authService } from '../../services/auth.service';

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout API failed', error);
  } finally {
    dispatch(logout());
    window.location.href = '/login';
  }
});

interface AuthState {
  token: string | null;
  user: any | null;
  rememberMe: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: getToken(),
  user: getUser(),
  rememberMe: localStorage.getItem('rememberMe') === 'true',
  isAuthenticated: !!getToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: any; rememberMe?: boolean }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.rememberMe !== undefined) {
        state.rememberMe = action.payload.rememberMe;
      }
      setToken(action.payload.token, action.payload.rememberMe);
      setUser(action.payload.user);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      clearAuthStorage();
    },
    setRememberMe(state, action: PayloadAction<boolean>) {
      state.rememberMe = action.payload;
    },
  },
});

export const { loginSuccess, logout, setRememberMe } = authSlice.actions;

export default authSlice.reducer;
