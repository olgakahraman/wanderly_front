import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const updateUser = useCallback(patch => {
    setUser(prev => (prev ? { ...prev, ...patch } : patch));
  }, []);

  const decodeAndSetUser = useCallback(tokenToDecode => {
    try {
      const decoded = jwtDecode(tokenToDecode);
      const userData = {
        userId: decoded.userId,
        username:
          decoded.username ||
          (decoded.email ? decoded.email.split('@')[0] : 'User'),
        email: decoded.email,
        role: decoded.role || 'user',
      };
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Token decode error:', error);
      setUser(null);
      return null;
    }
  }, []);

  const validateToken = useCallback(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(storedToken);
      const expired = decoded.exp * 1000 < Date.now();
      if (expired) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
      } else {
        setToken(storedToken);
        setIsAuthenticated(true);
        decodeAndSetUser(storedToken);
      }
    } catch (e) {
      console.error('Token validation error:', e);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [decodeAndSetUser]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const login = useCallback(
    newToken => {
      decodeAndSetUser(newToken);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setIsAuthenticated(true);
      navigate('/news-feed');
    },
    [navigate, decodeAndSetUser]
  );

  const applyToken = useCallback(
    newToken => {
      decodeAndSetUser(newToken);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setIsAuthenticated(true);
    },
    [decodeAndSetUser]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const getCurrentUser = useCallback(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        token,
        login,
        logout,
        getCurrentUser,
        applyToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
