const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (email, password) => {
  const res = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.errors?.[0]?.msg || 'Registration failed');
  }

  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Login failed');
  }

  return res.json();
};

export const requestPasswordReset = async email => {
  const res = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Failed to request password reset');
  return data;
};

export const resetPassword = async (token, password) => {
  const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Failed to reset password');
  return data;
};
