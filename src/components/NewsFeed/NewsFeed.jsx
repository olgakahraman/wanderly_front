import { useState, useEffect } from 'react';
import PostList from '../Post/PostList';
import { useLocation } from 'react-router-dom';
import styles from './NewsFeed.module.css';

const NewsFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const [refreshKey, setRefreshKey] = useState(0);

      useEffect(() => {
        if (location.state?.shouldRefresh) {
          setRefreshKey(prev => prev + 1);
        }
      }, [location.state]);

  return (
    <div className={styles.newsFeed}>
      <div className={styles.header}>
        <h1>Travel Stories</h1>

        <div className={styles.searchContainer}>
          <input
            type='text'
            placeholder='Search by tags, locations...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.postsContainer}>
        <PostList key={refreshKey} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default NewsFeed;
