import { useState } from 'react';
import styles from './MyProfile.module.css';

const PasswordModal = ({ isOpen, onClose, onChangePassword }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword)
      newErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword)
      newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6)
      newErrors.newPassword = 'Password must be at least 6 characters';
    else if (formData.newPassword.length > 100)
      newErrors.newPassword = 'Password must be less than 100 characters';
    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setIsLoading(true);
    try {
      const success = await onChangePassword(
        formData.currentPassword,
        formData.newPassword
      );
      if (success) handleClose();
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label='Close modal'
        >
          &times;
        </button>
        <h2>Change Password</h2>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Current Password</label>
            <input
              name='currentPassword'
              type='password'
              value={formData.currentPassword}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.currentPassword ? styles.inputError : ''
              }`}
              autoComplete='current-password'
            />
            {errors.currentPassword && (
              <div className={styles.fieldError}>{errors.currentPassword}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>New Password</label>
            <input
              name='newPassword'
              type='password'
              value={formData.newPassword}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.newPassword ? styles.inputError : ''
              }`}
              autoComplete='new-password'
            />
            {errors.newPassword && (
              <div className={styles.fieldError}>{errors.newPassword}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm New Password</label>
            <input
              name='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.confirmPassword ? styles.inputError : ''
              }`}
              autoComplete='new-password'
            />
            {errors.confirmPassword && (
              <div className={styles.fieldError}>{errors.confirmPassword}</div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type='submit'
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
