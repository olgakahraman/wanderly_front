import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import BigLoader from './components/BigLoader/BigLoader.jsx';
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
      <Suspense fallback={<BigLoader />}>
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
