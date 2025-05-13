import { useEffect, useState } from 'react';
import { fetchPosts } from '../../api/posts';
import styles from './Post.module.css';
import PostElement from './PostElement';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        setPosts(data.posts || []);
         setLoading(false);
      } catch (err) {
        console.error('Error loading posts:', err);
        setError(err.message);
         setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <div className={styles.loading}>Loading posts...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!posts.length) return <div className={styles.empty}>No posts found</div>;

  return (
    <div className={styles.postsContainer}>
      {posts.map(post => (
        <PostElement key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
