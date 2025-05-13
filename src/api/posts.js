const API_URL = 'http://localhost:3000/api/v1/posts';

const handleResponse = async response => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/`);
  return handleResponse(response);
};
export const createPost = async (postData, token) => {
  const response = await fetch(`${API_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  return handleResponse(response);
};

export const updatePost = async (id, postData, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  return handleResponse(response);
};

export const deletePost = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const toggleLike = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}/like`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
