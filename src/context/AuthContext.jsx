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
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setIsLoading(false);
         setIsAuthenticated(false);
        return;
      }

      try {
        const decoded = jwtDecode(storedToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setToken(null);
        } else {
          setIsAuthenticated(true);
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = useCallback(
    newToken => {
      localStorage.setItem('token', newToken);
      setIsAuthenticated(true);
      setToken(newToken);
      navigate('/news-feed');
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setToken(null);
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
