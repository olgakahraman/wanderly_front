import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '../context/AuthContext';

import styles from './AuthPage.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async ({ email, password }) => {
    try {
      const data = await loginUser(email, password);
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token);
      login(data.token);
      setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/news-feed'), 1500);
    } catch (error) {
      setMessage({
        text: error.message || 'Login failed. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className={`container-fluid ${styles.authContainer}`}>
      <div className='row'>
        <motion.div
          className={`col-md-6 ${styles.leftSection}`}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <img
            src='/images/wanderly-2.jpeg'
            alt='Traveling photos'
            className={styles.image}
          />
        </motion.div>
        <motion.div
          className={`col-md-6 d-flex flex-column justify-content-center align-items-center ${styles.rightSection}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className={`mb-4 ${styles.heading}`}>Login</h1>
          {message.text && (
            <div
              className={`alert alert-${
                message.type === 'success' ? 'success' : 'danger'
              } mb-3`}
            >
              {message.text}
            </div>
          )}
          <AuthForm type='login' onSubmit={handleSubmit} />
          <p className={styles.link}>
            <Link to='/forgot-password'>Forgot password?</Link>
          </p>
          <p className={styles.link}>
            New here? <Link to='/registration'>Join now</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
