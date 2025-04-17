import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WelcomePage.module.css';

function WelcomePage() {
  const [startTransition, setStartTransition] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setStartTransition(true);
    setTimeout(() => navigate('/login'), 600);
  };

  return (
    <main className={styles.hero}>
      <div className={`container-fluid ${styles.container}`}>
        <div className='row'>
          <motion.div
            className={`col-md-6 d-flex flex-column justify-content-center align-items-center ${styles.leftSection}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: startTransition ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.heading}>Wanderly</h1>
            <h3 className={styles.subHeading}>
              A social network for travel lovers.
            </h3>
            <button
              className={styles.button}
              aria-label='Get started with Wanderly'
              onClick={handleClick}
            >
              Get Started
            </button>
          </motion.div>
          <motion.div
            className={`col-md-6 ${styles.rightSection}`}
            initial={{ x: 0 }}
            animate={{ x: startTransition ? '-100%' : '0%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <img
              src='/images/wanderly-2.jpeg'
              alt='Traveling photos'
              className={styles.image}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default WelcomePage;
