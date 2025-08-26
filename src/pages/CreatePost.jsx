import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/Post/CreatePostForm';
import styles from '../components/Post/Post.module.css';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const CreatePost = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData, images) {
    if (submitting) return;
    setSubmitting(true);
    const fd = new FormData();
    fd.append('title', formData.title.trim());
    fd.append('content', formData.content.trim());
    if (formData.location?.trim())
      fd.append('location', formData.location.trim());
    fd.append('tags', formData.tags || '');

    images.forEach(f => fd.append('images', f));

    const res = await fetch(`${API_URL}/api/v1/posts`, {
      method: 'POST',
      body: fd,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('Create post failed:', text || res.status);
      setSubmitting(false);
      throw new Error(text || 'Error creating post');
    }
    const data = await res.json();
    navigate('/');
    setSubmitting(false);
  }

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
        <CreatePostForm onSubmit={handleSubmit} submitting={submitting} />
      </Suspense>
    </div>
  );
};

export default CreatePost;
