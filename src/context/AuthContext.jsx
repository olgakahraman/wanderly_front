import { jwtDecode } from 'jwt-decode';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const decodeAndSetUser = useCallback(tokenToDecode => {
    try {
      const decoded = jwtDecode(tokenToDecode);
      const userData = {
        userId: decoded.userId,
        username: decoded.username,
      };
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Token decode error:', error);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const validateToken = () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setIsLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      try {
        const decoded = jwtDecode(storedToken);
        const userData = {
          userId: decoded.userId,
          username: decoded.username,
        };
        setUser(userData);

        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setToken(null);
          setUser(null);
        } else {
          setIsAuthenticated(true);
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = useCallback(
    newToken => {
      const userData = decodeAndSetUser(newToken);

      localStorage.setItem('token', newToken);
      setIsAuthenticated(true);
      setToken(newToken);

      console.log('Login successful, user data:', userData);
      navigate('/news-feed');
    },
    [navigate, decodeAndSetUser]
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
