import axios from './axios';

// basic user methods
// This file contains the basic user methods that are used in the application.
const userService = {
  getAllUsers: async () => {
    const response = await axios.get('/users');
    console.log('response:', response.data);
    return response.data;
  },
  
  getUserById: async (id) => {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  },
  
  getCurrentUserProfile: async () => {
    const response = await axios.get('/users/me');
    return response.data;
  }
};

export default userService;