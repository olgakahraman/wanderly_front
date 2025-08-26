import PropTypes from 'prop-types';
import styles from './PageTitle.module.css';

const PageTitle = ({ children, subtitle }) => {
  return (
    <div className={styles.pageTitleWrapper}>
      <h1 className={styles.pageTitle}>{children}</h1>
      {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
    </div>
  );
};

PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
};

export default PageTitle;
