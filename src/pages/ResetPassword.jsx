import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import AuthForm from '../components/Auth/AuthForm';
import styles from './AuthPage.module.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleReset = async ({ password }) => {
    try {
      await resetPassword(token, password);
      setMessage({
        text: 'Password changed successfully! Redirecting to login...',
        type: 'success',
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({
        text: err.message || 'Failed to reset password',
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
            alt='Reset password illustration'
            className={styles.image}
          />
        </motion.div>
        <motion.div
          className={`col-md-6 d-flex flex-column justify-content-center align-items-center ${styles.rightSection}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className={`mb-4 ${styles.heading}`}>Set New Password</h1>
          
          {message.text && (
            <div
              className={`alert alert-${
                message.type === 'success' ? 'success' : 'danger'
              } mb-3`}
            >
              {message.text}
            </div>
          )}
          <AuthForm type='reset-password' onSubmit={handleReset} />
          <p className={`mt-3 ${styles.link}`}>
            Remember your password? <a href='/login'>Login</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
