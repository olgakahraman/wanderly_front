import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import fetchWithAuth from '../../utils/fetchWithAuth';
import { compressImage } from '../../utils/imageCompression';
import styles from './MyProfile.module.css';
import PasswordModal from './PasswordModal';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_AVATAR = '/images/default-avatar.jpg';

const MyProfile = () => {
  const { token, logout, applyToken, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState(null);

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadProfile = async () => {
    try {
      const data = await fetchWithAuth(`${API_URL}/api/v1/users/me`);
      setProfile(data);
      setUsername(data.username || '');
      setBio(data.bio || '');
      setAvatarPreview(
        data.avatar
          ? `${API_URL}/api/v1/users/${data._id}/avatar?t=${Date.now()}`
          : DEFAULT_AVATAR
      );
      setAvatarFile(null);
    } catch (err) {
      showNotification(err.message || 'Failed to load profile', true);
    }
  };

  useEffect(() => {
    if (token) loadProfile();
  }, [token]);

  const handleAvatarChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
        alert('Please choose a PNG/JPG/WEBP image');
        return;
      }

      const compressed = await compressImage(file, 512, 512, 0.8);

      if (avatarPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }

      setAvatarFile(compressed);
      setAvatarPreview(URL.createObjectURL(compressed));
    } catch (err) {
      console.error('Avatar compress error:', err);
      alert('Failed to process image');
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      showNotification('Username is required', true);
      return;
    }
    setIsSaving(true);
    try {
      await fetchWithAuth(`${API_URL}/api/v1/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), bio: bio.trim() }),
      });

      if (avatarFile) {
        const form = new FormData();
        form.append('avatar', avatarFile);
        const res = await fetch(`${API_URL}/api/v1/users/me/avatar`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.msg || e.error || 'Failed to upload avatar');
        }

        setAvatarPreview(
          `${API_URL}/api/v1/users/${profile._id}/avatar?t=${Date.now()}`
        );
      }
      updateUser({ username: username.trim(), bio: bio.trim() });

      const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!refreshRes.ok) throw new Error('Failed to refresh token');
      const newToken = await refreshRes.text();
      if (typeof applyToken === 'function') {
        applyToken(newToken);
      } else {
        localStorage.setItem('token', newToken);
      }

      await loadProfile();
      setIsEditing(false);
      showNotification('Profile updated successfully');
    } catch (err) {
      showNotification(err.message || 'Failed to update profile', true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Delete your avatar?')) return;
    try {
      await fetchWithAuth(`${API_URL}/api/v1/users/me/avatar`, {
        method: 'DELETE',
      });
      await loadProfile();
      showNotification('Avatar deleted');
    } catch (err) {
      showNotification(err.message || 'Failed to delete avatar', true);
    }
  };

  const handlePasswordChange = async (currentPassword, newPassword) => {
    try {
      await fetchWithAuth(`${API_URL}/api/v1/users/me/password`, {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      showNotification('Password updated successfully');
      return true;
    } catch (err) {
      showNotification(err.message || 'Failed to change password', true);
      return false;
    }
  };

  if (!profile) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          {isEditing ? (
            <button
              type='button'
              className={styles.cancelButton}
              onClick={() => {
                setUsername(profile.username || '');
                setBio(profile.bio || '');
                setAvatarPreview(
                  profile.avatar
                    ? `${API_URL}/api/v1/users/${
                        profile._id
                      }/avatar?t=${Date.now()}`
                    : DEFAULT_AVATAR
                );
                setAvatarFile(null);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>

        <div className={styles.avatarSection}>
          <img
            src={avatarPreview}
            alt='Avatar'
            className={styles.avatar}
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
          {isEditing ? (
            <>
              <input
                type='file'
                id='avatarUpload'
                accept='image/*'
                className={styles.avatarInput}
                onChange={handleAvatarChange}
              />
              <label htmlFor='avatarUpload' className={styles.avatarLabel}>
                Change Photo
              </label>
              {profile.avatar && (
                <button
                  type='button'
                  onClick={handleDeleteAvatar}
                  className={styles.deleteAvatarButton}
                >
                  Delete Avatar
                </button>
              )}
            </>
          ) : null}
        </div>

        <div>
          <div className={styles.inputGroup}>
            <label>Username</label>
            {isEditing ? (
              <input
                type='text'
                className={styles.input}
                value={username}
                onChange={e => setUsername(e.target.value)}
                minLength={3}
                required
              />
            ) : (
              <h2 className={styles.username}>{profile.username}</h2>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Bio</label>
            {isEditing ? (
              <textarea
                className={styles.textarea}
                rows={4}
                maxLength={500}
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            ) : profile.bio ? (
              <p className={styles.bio}>{profile.bio}</p>
            ) : null}
          </div>

          {!isEditing && <p className={styles.email}>{profile.email}</p>}
        </div>

        <div className={styles.userActions}>
          {isEditing ? (
            <>
              <button
                type='button'
                className={styles.secondaryButton}
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </button>
              <button
                type='button'
                className={styles.button}
                disabled={isSaving}
                onClick={handleSave}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                type='button'
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                type='button'
                className={styles.logoutButton}
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      {notification && (
        <div
          className={`${styles.notification} ${
            notification.isError ? styles.error : styles.success
          }`}
        >
          {notification.message}
        </div>
      )}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onChangePassword={handlePasswordChange}
      />
    </div>
  );
};

export default MyProfile;
