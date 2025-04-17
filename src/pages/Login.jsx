import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = ({ email, password }) => {
    console.log('Login ==>', email, password);
    login();
    navigate('/news-feed');
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
