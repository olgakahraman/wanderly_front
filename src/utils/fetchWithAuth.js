const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Request failed');
  }

  return response.json();
};

export default fetchWithAuth;
