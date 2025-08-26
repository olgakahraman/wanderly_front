import PropTypes from 'prop-types';
import styles from './Post.module.css';
import PostElement from './PostElement';

const PostList = ({ posts, onLike, onDelete, onUpdate }) => {
  if (!posts?.length) {
    return <div className={styles.empty}>No posts yet</div>;
  }

  return (
    <div className={styles.postsContainer}>
      {posts.map(post => (
        <PostElement
          key={post._id}
          post={post}
          onLike={onLike}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onLike: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
};

PostList.defaultProps = {
  onLike: undefined,
  onDelete: undefined,
  onUpdate: undefined,
};


export default PostList;
