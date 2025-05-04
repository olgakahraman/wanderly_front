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
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = useCallback(
    token => {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      navigate('/news-feed');
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const getCurrentUser = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
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
