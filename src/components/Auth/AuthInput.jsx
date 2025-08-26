import PropTypes from 'prop-types';
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

AuthInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  register: PropTypes.func.isRequired,
  error: PropTypes.string,
  autoComplete: PropTypes.string,
};

AuthInput.defaultProps = {
  type: 'text',
  placeholder: '',
  error: undefined,
  autoComplete: undefined,
};

export default AuthInput;
