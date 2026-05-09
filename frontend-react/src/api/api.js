import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealthCheck = async () => {
  const response = await api.get('/');
  return response.data;
};

export default api;
