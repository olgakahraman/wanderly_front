import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home.jsx'));
const WelcomePage = lazy(() => import('../components/Welcome/WelcomePage.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Registration = lazy(() => import('../pages/Registration.jsx'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword.jsx'));

const PublicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/welcome', element: <WelcomePage /> },
  { path: '/login', element: <Login /> },
  { path: '/registration', element: <Registration /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
];

export default PublicRoutes;
