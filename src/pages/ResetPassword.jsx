import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import styles from './AuthPage.module.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async e => {
    e.preventDefault();
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
        <div className='col-md-6 offset-md-3'>
          <h2 className='mb-4'>Reset your password</h2>
          {message.text && (
            <div
              className={`alert alert-${
                message.type === 'success' ? 'success' : 'danger'
              } mb-3`}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className='form-group mb-3'>
              <label className='form-label'>New Password</label>
              <input
                type='password'
                className='form-control'
                placeholder='Enter new password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type='submit' className='btn btn-primary'>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
