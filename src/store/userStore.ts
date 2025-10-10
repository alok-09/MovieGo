import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, data } = response.data;
      localStorage.setItem('token', token);

      set({
        user: data.user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      const { token, data } = response.data;
      localStorage.setItem('token', token);

      set({
        user: data.user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        user: response.data.data.user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
