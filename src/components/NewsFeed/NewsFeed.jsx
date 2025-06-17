import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  deletePost,
  fetchPosts,
  toggleLike,
  updatePost,
} from '../../api/posts';
import { useAuth } from '../../context/AuthContext';
import PostList from '../Post/PostList';
import styles from './NewsFeed.module.css';

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchPosts();
      setPosts(data || []);
    } catch (err) {
      setError(err.message);
      showNotification('Failed to load posts', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      loadPosts();
    }
  }, [token, user]);

  useEffect(() => {
    if (!token) {
      setPosts([]);
    }
  }, [token]);

  useEffect(() => {
    if (location.state?.shouldRefresh || location.state?.refresh) {
      loadPosts();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (token && user && posts.length > 0) {
      loadPosts();
    }
  }, [user?.userId]); 

  const handleLike = async postId => {
    if (!token) {
      showNotification('Please login to like posts', true);
      return;
    }

    try {
      console.log('=== CLIENT LIKE DEBUG ===');
      console.log('Toggling like for post:', postId);
      console.log('Current user:', user);
      console.log('Token exists:', !!token);

      const updatedPost = await toggleLike(postId, token);
      console.log('Like response received:', updatedPost);

      if (!updatedPost || !updatedPost._id) {
        throw new Error('Invalid response from server');
      }

      setPosts(prevPosts => {
        const newPosts = prevPosts.map(post =>
          post._id === postId ? updatedPost : post
        );
        console.log('Updated posts state');
        return newPosts;
      });

      console.log('user.userId:', user.userId);
      console.log('updatedPost.likes:', updatedPost.likes);

      const userLiked = updatedPost.likes.some(like => {
        if (typeof like === 'string') return like === user.userId;
        if (typeof like === 'object' && like !== null) {
          return like._id?.toString() === user.userId;
        }
        return false;
      });
      console.log('userLiked:', userLiked);
      showNotification(userLiked ? 'Post liked!' : 'Like removed!');
      console.log('=== END CLIENT LIKE DEBUG ===');
    } catch (err) {
      console.error('=== CLIENT LIKE ERROR ===');
      console.error('Like error:', err);
      console.error('Error message:', err.message);
      console.error('=== END CLIENT ERROR ===');

      showNotification(err.message || 'Failed to toggle like', true);
    }
  };

  const handleDelete = async postId => {
    if (!token) {
      showNotification('Please login to delete posts', true);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      console.log('Deleting post:', postId);
      await deletePost(postId, token);
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      showNotification('Post deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      showNotification(err.message || 'Failed to delete post', true);
    }
  };

  const handleUpdate = async (postId, updatedData) => {
    try {
      console.log('Client update data:', updatedData);

      const updatePayload = {
        title: updatedData.title,
        content: updatedData.content,
        location: updatedData.location || null,
        tags: Array.isArray(updatedData.tags)
          ? updatedData.tags
          : (updatedData.tags || '').split(',').filter(t => t.trim()),
      };

      const response = await updatePost(postId, updatePayload, token);

      if (!response.post) {
        throw new Error('Invalid server response');
      }

      setPosts(prevPosts =>
        prevPosts.map(p => (p._id === response.post._id ? response.post : p))
      );

      showNotification('Post updated successfully');
      return true;
    } catch (err) {
      console.error('Update failed:', err);
      showNotification(err.message || 'Failed to update post', true);
      return false;
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.newsFeed}>
      <h1 className={styles.title}>Travel Stories</h1>

      {notification && (
        <div
          className={`${styles.notification} ${
            notification.isError ? styles.error : styles.success
          }`}
        >
          {notification.message}
        </div>
      )}

      <PostList
        posts={posts}
        onLike={handleLike}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default NewsFeed;
