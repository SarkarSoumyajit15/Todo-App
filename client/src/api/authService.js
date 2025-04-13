import axios from './axios';

const authService = {
  login: async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    if (response.data.token) {

      // creating the local storage items
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('originalUser', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  
  signup: async (userData) => {
    const response = await axios.post('/auth/signup', userData);
    return response.data;
  },
  
  logout:async () => {

    // removing the local storage items once the user logs out
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('viewingAs');
    localStorage.removeItem('originalUser');
    localStorage.removeItem('currentUser');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');

    // as the user is stored in the local storage as a string, we need to parse it to get the object
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // impliementing basic authentication in frontend
  // checking if the user is authenticated or not
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  


  
  // not implimented yet but kept for future use
  updateProfile: async (userData) => {
    const response = await axios.patch('/users/me', userData);
    if (response.data.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  
  // not implimented yet but kept for future use
  changePassword: async (passwordData) => {
    const response = await axios.patch('/users/updatePassword', passwordData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  // not implimented yet but kept for future use
  refreshToken: async () => {
    try {
      const response = await axios.get('/auth/refresh-token');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return true;
    } catch (error) {
      return false;
    }
  },




// Add these methods to your existing authService.js

// Save the original user before switching
saveOriginalUser: (user) => {
  localStorage.setItem('originalUser', JSON.stringify(user));
},

// Get the original user
getOriginalUser: () => {
  const originalUser = localStorage.getItem('originalUser');

  return originalUser ? JSON.parse(originalUser) : null;
},

// Set the current user (for user switching)
setCurrentUser: (user) => {
  localStorage.setItem('user', JSON.stringify(user));
},

// Set viewing as flag
setViewingAs: (user) => {
  localStorage.setItem('viewingAs', JSON.stringify(user));
},

// Clear viewing as flag
clearViewingAs: () => {
  localStorage.removeItem('viewingAs');
},

// Check if user is viewing as someone else
isViewingAs: () => {
  return localStorage.getItem('viewingAs') !== null;
}
};

export default authService;