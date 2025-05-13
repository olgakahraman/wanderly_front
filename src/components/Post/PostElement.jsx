import { useAuth } from '../../context/AuthContext';
import styles from './Post.module.css';

const PostElement = ({ post, onLike, onDelete }) => {
  const { getCurrentUser } = useAuth();
  const isAuthor = getCurrentUser()?.userId === post.author;

  return (
    <div className={styles.postCard}>
      <h3 className={styles.postTitle}>{post.title}</h3>
      <p className={styles.postContent}>{post.content}</p>

      {post.location && (
        <p className={styles.postLocation}>📍 {post.location}</p>
      )}

      <div className={styles.postFooter}>
        <button onClick={() => onLike(post._id)} className={styles.likeButton}>
          ❤️ {post.likes?.length || 0}
        </button>

        {isAuthor && (
          <div className={styles.authorControls}>
            <button className={styles.editButton}>✏️ Edit</button>
            <button
              onClick={() => onDelete(post._id)}
              className={styles.deleteButton}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostElement;
