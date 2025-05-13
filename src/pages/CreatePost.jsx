import { Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePostForm from '../components/Post/CreatePostForm';
import { createPost } from '../api/posts';
import styles from '../components/Post/Post.module.css';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async postData => {
    try {
      await createPost(postData, token);
      navigate('/news-feed', { state: { shouldRefresh: true } });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.authMessage}>Please login to create posts</div>
    );
  }

  return (
    <div className={styles.createPostPage}>
      <h1 className={styles.pageTitle}>Create New Travel Post</h1>
      <Suspense
        fallback={<div className={styles.loading}>Loading form...</div>}
      >
        <CreatePostForm onSubmit={handleSubmit} />
      </Suspense>
    </div>
  );
};

export default CreatePost;
