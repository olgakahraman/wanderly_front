import React from 'react';
import styles from './AuthButton.module.css';

const AuthButton = ({ children, ...props }) => {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
};

export default AuthButton;
