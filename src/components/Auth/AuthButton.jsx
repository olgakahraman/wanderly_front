import PropTypes from 'prop-types';
import styles from './AuthButton.module.css';

const AuthButton = ({ children, ...props }) => {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
};
AuthButton.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AuthButton;
