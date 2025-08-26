import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { avatarUrl } from '../../utils/avatarUrl';
import styles from './Navbar.module.css';

function Navbar() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isLoading) return null;
    if (!isAuthenticated) return null;

  const unauthPages = [
    '/login',
    '/registration',
    '/forgot-password',
    '/welcome',
  ];
  const isOnUnauthPage = unauthPages.includes(location.pathname);

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${styles.navNavbar} ${
        scrolled ? styles.scrolled : ''
      }`}
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='container-fluid d-flex justify-content-between'>
        {/* Left: Brand + user bubble */}
        <div className='d-flex align-items-center'>
          <NavLink className={styles.brand} to='/' title='Home'>
            Wanderly
          </NavLink>
          {isAuthenticated && user && (
            <div className={styles.userBubble}>
              <img
                src={avatarUrl(user)}
                alt='avatar'
                className={styles.userAvatar}
              />
              <span className={styles.userInfo}>
                {user?.username || user?.email?.split('@')[0] || 'User'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Nav links */}
        <ul className='navbar-nav d-flex flex-row align-items-center'>
          {isAuthenticated && !isOnUnauthPage && (
            <>
              <li className='nav-item me-3'>
                <NavLink
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                  }
                  to='/create-post'
                  title='Create a Post'
                >
                  <i className='fa-solid fa-square-plus d-md-none' />
                  <span className='d-none d-md-inline'>Create a Post</span>
                </NavLink>
              </li>

              <li className='nav-item me-3'>
                <NavLink
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                  }
                  to='/profile'
                  title='Profile'
                >
                  <i className='fa-solid fa-user d-md-none' />
                  <span className='d-none d-md-inline'>Profile</span>
                </NavLink>
              </li>

              <li className='nav-item me-3'>
                <button
                  onClick={logout}
                  className={styles.navLink}
                  type='button'
                  title='Logout'
                >
                  <i className='fa-solid fa-right-from-bracket d-md-none' />
                  <span className='d-none d-md-inline'>Logout</span>
                </button>
              </li>
            </>
          )}

          {!isAuthenticated && !isOnUnauthPage && (
            <li className='nav-item me-3'>
              <NavLink className={styles.navLink} to='/login' title='Login'>
                <i className='fa-solid fa-right-to-bracket' />
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
