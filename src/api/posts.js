const API_BASE = import.meta.env.VITE_API_URL;
const POSTS_URL = `${API_BASE}/api/v1/posts`;

const pickError = (data, fallback) =>
  data?.error || data?.msg || data?.message || fallback;

const handleResponse = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(pickError(data, fallbackMessage));
  return data;
};

export const fetchPosts = async () => {
  const res = await fetch(`${POSTS_URL}`);
  const data = await handleResponse(res, 'Failed to fetch posts');
  return data.posts || [];
};

export const createPost = async (postData, token) => {
  let body;
  if (postData instanceof FormData) {
    body = postData;
  } else {
    body = new FormData();
    body.append('title', postData.title);
    body.append('content', postData.content);
    if (postData.location) body.append('location', postData.location);
    if (postData.tags) body.append('tags', postData.tags);
    if (Array.isArray(postData.images)) {
      postData.images.forEach(f => body.append('images', f));
    }
  }

  const res = await fetch(POSTS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = await handleResponse(res, 'Failed to create post');
  return data.post;
};

export const updatePost = async (id, postData, token) => {
  const res = await fetch(`${POSTS_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  const data = await handleResponse(res, 'Failed to update post');
  return data.post;
};

export const deletePost = async (id, token) => {
  const res = await fetch(`${POSTS_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, 'Failed to delete post'); // { msg }
};

export const toggleLike = async (id, token) => {
  const res = await fetch(`${POSTS_URL}/${id}/like`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await handleResponse(res, 'Failed to toggle like');
  return data.post;
};
