const API_URL = import.meta.env.VITE_API_URL;
export function avatarUrl(u) {
  if (!u) return '/images/default-avatar.jpg';
  const id = u._id || u.userId;
  const has = u.hasAvatar === true; 
  return has && id
    ? `${API_URL}/api/v1/users/${id}/avatar`
    : '/images/default-avatar.jpg';
}