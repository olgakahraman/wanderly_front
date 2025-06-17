import { useState } from 'react';
import styles from './Post.module.css';

const CreatePostForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    tags: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
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

      <button type='submit' className={styles.button}>
        Publish Post
      </button>
    </form>
  );
};

export default CreatePostForm;
