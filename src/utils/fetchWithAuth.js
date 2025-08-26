const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.msg || errorData.error || 'Request failed';
    throw new Error(message);
  }

  return response.json();
};

export default fetchWithAuth;
