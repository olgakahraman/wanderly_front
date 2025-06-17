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
  const data = await handleResponse(response);
  console.log(data.posts);
  return data.posts;
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

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create post');
  }

  return await response.json();
};

export const updatePost = async (id, postData, token) => {
  try {
    console.log('Sending update:', { id, postData });

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error response:', errorData);
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Full update error:', err);
    throw new Error(`Update failed: ${err.message}`);
  }
};

export const deletePost = async (id, token) => {
  if (!token) throw new Error('No token provided');

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json', // Добавляем Content-Type
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || errorData.msg || 'Failed to delete post'
    );
  }

  return await response.json();
};

export const toggleLike = async (id, token) => {
  if (!token) throw new Error('No token provided');

  console.log('Sending like request for post:', id);
  console.log('Token exists:', !!token);

  try {
    const response = await fetch(`${API_URL}/${id}/like`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Like response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Like error response:', errorData);

      throw new Error(
        errorData.error ||
          errorData.message ||
          errorData.msg ||
          `HTTP ${response.status}: Failed to toggle like`
      );
    }

    const result = await response.json();
    console.log('Like success response:', result);

    return result;
  } catch (error) {
    console.error('toggleLike fetch error:', error);
    throw error;
  }
};
