const API_URL = import.meta.env.VITE_API_URL;
export const avatarUrl = userId =>
  userId ? `${API_URL}/api/v1/users/${userId}/avatar` : '';
