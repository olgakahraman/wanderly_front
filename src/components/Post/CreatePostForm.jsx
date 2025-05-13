import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Post.module.css';

const CreatePostForm = ({ onSubmit }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());
      await onSubmit({ ...formData, tags: tagsArray }, token);
      navigate('/news-feed');
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            name='title'
            value={formData.title}
            onChange={handleChange}
            placeholder='Post title'
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <textarea
            name='content'
            value={formData.content}
            onChange={handleChange}
            placeholder='Share your story...'
            className={styles.textarea}
            required
            rows={5}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            name='location'
            value={formData.location}
            onChange={handleChange}
            placeholder='Location'
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            name='tags'
            value={formData.tags}
            onChange={handleChange}
            placeholder='Tags (comma separated)'
            className={styles.input}
          />
        </div>

        <button type='submit' className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePostForm;
