import React from 'react';
import styles from './AuthInput.module.css';

const AuthInput = ({ name, type, placeholder, register, error }) => {
  return (
    <div className={styles.inputWrapper}>
      <input
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...register(name)}
        type={type}
        placeholder={placeholder}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default AuthInput;
