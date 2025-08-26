import { useEffect, useState } from 'react';
import { compressImage } from '../../utils/imageCompression';
import styles from './Post.module.css';

const MAX_FILES = 10;

const CreatePostForm = ({ onSubmit, submitting = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    tags: '',
  });
  const [images, setImages] = useState([]); // Array<File>
  const [previews, setPreviews] = useState([]); // Array<string>
  const [isDragging, setIsDragging] = useState(false);

  const uniqFiles = files => {
    const map = new Map();
    for (const f of files) map.set(`${f.name}-${f.size}`, f);
    return [...map.values()];
  };

  const processFiles = async fileList => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const imgs = files.filter(f => /^image\/(png|jpe?g|webp)$/i.test(f.type));
    if (!imgs.length) {
      alert('Please select PNG/JPG/WEBP images');
      return;
    }

    try {
      const compressed = await Promise.all(
        imgs.map(f => compressImage(f, 1600, 1600, 0.85))
      );

      const newUrls = compressed.map(f => URL.createObjectURL(f));

      setImages(prev => {
        const next = uniqFiles([...prev, ...compressed]).slice(0, MAX_FILES);
        return next;
      });

      setPreviews(prev => [...prev, ...newUrls].slice(0, MAX_FILES));
    } catch (err) {
      console.error('Post images compress error:', err);
      alert('Failed to process selected images');
    }
  };

  const onPick = async e => {
    await processFiles(e.target.files);
    e.target.value = '';
  };

  const onDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = async e => {
    e.preventDefault();
    setIsDragging(false);
    await processFiles(e.dataTransfer.files);
  };

  useEffect(() => {
    return () => {
      previews.forEach(
        url => url?.startsWith('blob:') && URL.revokeObjectURL(url)
      );
    };
  }, [previews]);

  useEffect(() => {
    return () =>
      previews.forEach(
        url => url?.startsWith?.('blob:') && URL.revokeObjectURL(url)
      );
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeImageAt = index => {
    const url = previews[index];
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);

    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.title || formData.title.trim().length < 3) {
      alert('Title must be at least 3 characters');
      return;
    }
    if (!formData.content || formData.content.trim().length < 10) {
      alert('Content must be at least 10 characters');
      return;
    }
    try {
      await onSubmit(formData, images);
    } catch (err) {
      alert(err.message || 'Failed to create post');
    }
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
        <div
          className={`${styles.dropzone} ${
            isDragging ? styles.dropzoneActive : ''
          }`}
          onClick={() => document.getElementById('fileInput')?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            id='fileInput'
            type='file'
            accept='image/*'
            multiple
            onChange={onPick}
            style={{ display: 'none' }}
          />
          <div className={styles.dropzoneText}>
            <strong>Upload images</strong> — click to choose or drag & drop here
            <div className={styles.counter}>
              {images.length}/{MAX_FILES}
            </div>
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div className={styles.imageGrid}>
          {previews.map((src, i) => (
            <div key={i} className={styles.thumb}>
              <img src={src} alt='' className={styles.postImage} />
              <button
                type='button'
                className={styles.removeBtn}
                onClick={() => {
                  setImages(prev => prev.filter((_, idx) => idx !== i));
                  setPreviews(prev => {
                    const copy = [...prev];
                    const [removed] = copy.splice(i, 1);
                    if (removed?.startsWith?.('blob:'))
                      URL.revokeObjectURL(removed);
                    return copy;
                  });
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

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

      <button type='submit' className={styles.button} disabled={submitting}>
        {submitting ? 'Publishing…' : 'Publish Post'}+{' '}
      </button>
    </form>
  );
};

export default CreatePostForm;
