import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '../context/AuthContext';
 import { registerUser } from '../api/auth';
import styles from './AuthPage.module.css';

const Registration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async ({ email, password }) => {
    try {
      const data = await registerUser(email, password);
      console.log('Registration successful:', data);

      login();
      navigate('/news-feed');
    } catch (error) {
      alert(error.message);
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
