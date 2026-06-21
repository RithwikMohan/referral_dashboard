export const BASE_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api';

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Invalid email or password');
  }
  return data;
};

export const fetchReferrals = async (token, search = '', sort = 'desc') => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);

  const response = await fetch(`${BASE_URL}/referrals?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch referrals');
  }
  return data.data;
};

export const fetchReferralById = async (token, id) => {
  const response = await fetch(`${BASE_URL}/referrals?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Referral not found');
  }
  return data.data;
};
