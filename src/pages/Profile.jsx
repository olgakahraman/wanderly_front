import styles from '../components/Post/Post.module.css';
import MyProfile from '../components/Profile/MyProfile';

const Profile = () => {
  return (
    <div>
      <h1 className={styles.pageTitle}>My Profile</h1>
      <MyProfile />
    </div>
  );
};

export default Profile;
