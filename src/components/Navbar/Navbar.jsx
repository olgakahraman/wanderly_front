import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { avatarUrl } from '../../utils/avatarUrl';
import styles from './Navbar.module.css';

function Navbar() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  const unauthPages = [
    '/login',
    '/registration',
    '/forgot-password',
    '/welcome',
  ];
  const isOnUnauthPage = unauthPages.includes(location.pathname);

  return (
    <nav
      className={`navbar fixed-top navbar-expand-lg ${styles.navNavbar}`}
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='container-fluid'>
        <div className='d-flex align-items-center'>
          <NavLink className={styles.navLink} to='/' title='Home'>
            Wanderly
          </NavLink>
          {isAuthenticated && user && (
            <div className={styles.userBubble}>
              <img
                src={avatarUrl(user._id || user.userId)}
                alt='avatar'
                className={styles.userAvatar}
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/default-avatar.jpg';
                }}
              />
              <span className={styles.userInfo}>
                {user?.username || user?.email?.split('@')[0] || 'User'}
              </span>
            </div>
          )}
        </div>
        <div className='navbarNav' id='navbarNav'>
          <ul className='navbar-nav d-flex flex-row'>
            {isAuthenticated && !isOnUnauthPage && (
              <>
                <li className='nav-item me-3 auth-link'>
                  <NavLink
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                    }
                    to='/create-post'
                    title='Create a Post'
                  >
                    <i
                      className='fa-solid fa-square-plus d-md-none'
                      aria-hidden='true'
                    ></i>
                    <span className='d-none d-md-inline text'>
                      Create a Post
                    </span>
                  </NavLink>
                </li>
                <li className='nav-item me-3 auth-link'>
                  <NavLink
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                    }
                    to='/profile'
                    title='Profile'
                  >
                    <i
                      className='fa-solid fa-user d-md-none'
                      aria-hidden='true'
                    ></i>
                    <span className={`d-none d-md-inline ${styles.text}`}>
                      Profile
                    </span>
                  </NavLink>
                </li>
                <li className='nav-item me-3 auth-link'>
                  <button
                    onClick={logout}
                    className={styles.navLink}
                    title='Logout'
                    type='button'
                  >
                    <i
                      className='fa-solid fa-right-from-bracket d-md-none'
                      aria-hidden='true'
                    ></i>
                    <span className='d-none d-md-inline text'>Logout</span>
                  </button>
                </li>
              </>
            )}
            {!isAuthenticated && !isOnUnauthPage && (
              <li className='nav-item me-3'>
                <NavLink className={styles.navLink} to='/login' title='Login'>
                  <i
                    className='fa-solid fa-right-to-bracket'
                    aria-hidden='true'
                  ></i>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
