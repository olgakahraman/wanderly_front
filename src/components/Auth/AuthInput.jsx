import React from 'react';
import styles from './AuthInput.module.css';

const AuthInput = ({
  name,
  type,
  placeholder,
  register,
  error,
  autoComplete,
}) => {
  return (
    <div className={styles.inputWrapper}>
      <input
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...register(name)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default AuthInput;
