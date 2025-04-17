import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoutes from './routes/PrivateRoutes.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PublicRoutes from './routes/PublicRoutes.jsx';

import './App.css';

function App() {
  console.log('PublicRoutes:', PublicRoutes);
  console.log('PrivateRoutes:', PrivateRoutes);
  return (
    <AuthProvider>
      <Navbar />
      <Suspense fallback={<div className='loading'>Loading...</div>}>
        <Routes>
          {PublicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          {PrivateRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<ProtectedRoute>{element}</ProtectedRoute>}
            />
          ))}
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
