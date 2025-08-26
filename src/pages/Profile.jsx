import styles from '../components/Post/Post.module.css';
import MyProfile from '../components/Profile/MyProfile';
import PageTitle from '../components/Layout/PageTitle/PageTitle';

const Profile = () => {
  return (
    <div>
      <PageTitle>My Profile</PageTitle>
      <MyProfile />
    </div>
  );
};

export default Profile;
