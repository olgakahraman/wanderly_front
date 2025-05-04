import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

const Registration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async ({ email, password }) => {
    try {
      const data = await registerUser(email, password);
      console.log('Registration successful:', data);

      login(data.token);
      setMessage({
        text: 'Registration successful! Redirecting...',
        type: 'success',
      });

      setTimeout(() => navigate('/news-feed'), 1500);
    } catch (error) {
      setMessage({
        text: error.message || 'Registration failed. Please try again.',
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
            alt='Traveling inspiration'
            className={styles.image}
          />
        </motion.div>
        <motion.div
          className={`col-md-6 d-flex flex-column justify-content-center align-items-center ${styles.rightSection}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className={`mb-4 ${styles.heading}`}>Create Account</h1>
          {message.text && (
            <div
              className={`alert alert-${
                message.type === 'success' ? 'success' : 'danger'
              } mb-3`}
            >
              {message.text}
            </div>
          )}
          <AuthForm type='register' onSubmit={handleSubmit} />
          <p className={styles.link}>
            Already have an account? <Link to='/login'>Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Registration;
