import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Post.module.css';

const API_URL = import.meta.env.VITE_API_URL;
const makeUrl = src => (src?.startsWith('http') ? src : `${API_URL}${src}`);

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

  const isAuthor = useMemo(() => {
    if (!user) return false;
    const uid = user.userId || user._id;
    const authorId =
      (post.author && (post.author._id || post.author.toString?.())) || null;
    return uid && authorId && String(uid) === String(authorId);
  }, [user, post.author]);

  const isLiked = useMemo(() => {
    if (!user || !Array.isArray(post.likes)) return false;
    const uid = user.userId || user._id;
    return post.likes.some(id => String(id) === String(uid));
  }, [user, post.likes]);

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
            .filter(Boolean) || [],
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
        {Array.isArray(post.images) && post.images.length > 0 && (
          <div className={styles.gallery}>
            {post.images.map((src, i) => (
              <img
                key={`${post._id}-img-${i}`}
                src={makeUrl(src)}
                alt=''
                className={styles.galleryImg}
                loading='lazy'
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ))}
          </div>
        )}
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
        <div className={styles.authorBox}>
          <img
            className={styles.authorAvatar}
            src={
              post?.author?.hasAvatar
                ? makeUrl(
                    `/api/v1/users/${post.author._id || post.author}/avatar`
                  )
                : '/default-avatar.jpg'
            }
            alt='author'
            loading='lazy'
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/default-avatar.jpg';
            }}
          />
          <span className={styles.author}>
            {' '}
            {post.author?.username || post.author?.email || 'Unknown'}
          </span>
        </div>
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

      {Array.isArray(post.images) &&
        post.images.length > 0 &&
        (() => {
          const carouselId = `post-${post._id}-carousel`;
          return (
            <div
              id={carouselId}
              className='carousel slide'
              data-bs-ride='false'
            >
              <div className='carousel-inner'>
                {post.images.map((src, i) => (
                  <div
                    key={`${post._id}-img-${i}`}
                    className={`carousel-item ${i === 0 ? 'active' : ''}`}
                  >
                    <img
                      src={makeUrl(src)}
                      alt=''
                      className={`d-block w-100 img-fluid ${styles.postImg}`}
                      loading='lazy'
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                ))}
              </div>

              {post.images.length > 1 && (
                <>
                  <button
                    className='carousel-control-prev'
                    type='button'
                    data-bs-target={`#${carouselId}`}
                    data-bs-slide='prev'
                  >
                    <span
                      className='carousel-control-prev-icon'
                      aria-hidden='true'
                    ></span>
                    <span className='visually-hidden'>Previous</span>
                  </button>
                  <button
                    className='carousel-control-next'
                    type='button'
                    data-bs-target={`#${carouselId}`}
                    data-bs-slide='next'
                  >
                    <span
                      className='carousel-control-next-icon'
                      aria-hidden='true'
                    ></span>
                    <span className='visually-hidden'>Next</span>
                  </button>

                  <div className='carousel-indicators'>
                    {post.images.map((_, i) => (
                      <button
                        key={`ind-${post._id}-${i}`}
                        type='button'
                        data-bs-target={`#${carouselId}`}
                        data-bs-slide-to={i}
                        className={i === 0 ? 'active' : ''}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })()}

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
          className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
          disabled={isLiking}
        >
          {isLiking ? '❤️ Loading...' : `❤️ ${post.likes?.length || 0}`}
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
