import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

// Login
export const loginUser = async (data) => {
  const response = await API.post('/login', data);
  return response.data;
};

// Add user
export const addUser = async (data) => {
  const response = await API.post('/add-user', data);
  return response.data;
};
