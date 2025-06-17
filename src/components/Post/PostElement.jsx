import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Post.module.css';

const PostElement = ({ post, onLike, onDelete, onUpdate, likingPostId }) => {
  const { user } = useAuth();
  const isLiking = likingPostId === post._id;
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    title: post.title,
    content: post.content,
    location: post.location || '',
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
  });

  const isAuthor =
    user &&
    (user.userId === post.author?._id ||
      user.userId === post.author?.toString() ||
      user._id === post.author?._id);

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!editedData.title || editedData.title.trim().length < 3) {
        throw new Error('Title must be at least 3 characters');
      }
      if (!editedData.content || editedData.content.trim().length < 10) {
        throw new Error('Content must be at least 10 characters');
      }

      const updateData = {
        title: editedData.title.trim(),
        content: editedData.content.trim(),
        location: editedData.location?.trim() || null,
        tags:
          editedData.tags
            ?.split(',')
            .map(t => t.trim())
            .filter(t => t) || [],
      };

      const success = await onUpdate(post._id, updateData);
      if (success) setIsEditing(false);
    } catch (err) {
      console.error('Save error:', err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className={styles.editForm}>
        <input
          name='title'
          value={editedData.title}
          onChange={handleEditChange}
          className={styles.input}
          required
        />
        <textarea
          name='content'
          value={editedData.content}
          onChange={handleEditChange}
          className={styles.textarea}
          rows={5}
          required
        />
        <input
          name='location'
          value={editedData.location}
          onChange={handleEditChange}
          className={styles.input}
          placeholder='Location'
        />
        <input
          name='tags'
          value={editedData.tags}
          onChange={handleEditChange}
          className={styles.input}
          placeholder='Tags (comma separated)'
        />
        <div className={styles.editActions}>
          <button
            onClick={() => setIsEditing(false)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={styles.saveButton}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.postCard}>
      <div className={styles.postMeta}>
        <span className={styles.author}>
          Posted by: {post.author?.username || post.author?.email || 'Unknown'}
        </span>
        <span className={styles.postDate}>
          {new Date(post.createdAt).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </span>
      </div>

      <h3 className={styles.postTitle}>{post.title}</h3>
      <p className={styles.postContent}>{post.content}</p>

      {post.location && (
        <p className={styles.postLocation}>📍 {post.location}</p>
      )}

      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className={styles.postFooter}>
        <button
          onClick={() => onLike?.(post._id)}
          className={styles.likeButton}
          disabled={likingPostId === post._id}
        >
          {likingPostId === post._id
            ? '❤️ Loading...'
            : `❤️ ${post.likes?.length || 0}`}
        </button>

        {isAuthor && (
          <div className={styles.authorControls}>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(post._id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostElement;
