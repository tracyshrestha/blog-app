import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '../stores/authStore';

const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, login: loginStore, logout: logoutStore, register: registerStore } = useAuthStore();

  const login = async (email, password) => {
    try {
      // Mock API call - in real app, call your backend
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock successful login
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      loginStore(mockUser, mockToken);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock successful registration
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      registerStore(mockUser, mockToken);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    logoutStore();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
};

export default useAuth;
