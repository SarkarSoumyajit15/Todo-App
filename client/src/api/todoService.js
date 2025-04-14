import authService from './authService';
import axios from './axios';

const todoService = {
  getAllTodos: async () => {
    const queryParams = new URLSearchParams();
    // Add userId to query params if it exists in localStorage
    const currentUser = authService.getCurrentUser();
    const userId = currentUser ? currentUser._id : null;
    if (userId) {
      queryParams.append('userId', userId);
    }

    const response = await axios.get(`/todos?${queryParams.toString()}`);
    return response.data;
  },
  
  getTodoById: async (id) => {
    const response = await axios.get(`/todos/${id}`);
    return response.data;
  },
  
  createTodo: async (todoData) => {
    const response = await axios.post('/todos', todoData);
    return response.data;
  },
  
  updateTodo: async (id, todoData) => {
    const response = await axios.patch(`/todos/${id}`, todoData);
    return response.data;
  },
  
  deleteTodo: async (id) => {
    const response = await axios.delete(`/todos/${id}`);
    return response.data;
  },
  
  addNote: async (todoId, noteContent) => {
    const response = await axios.post(`/todos/${todoId}/notes`, { content: noteContent });
    return response.data;
  },
  
  toggleComplete: async (id, completed) => {
    const response = await axios.patch(`/todos/${id}`, { completed });
    return response.data;
  },
  
  // Tag related methods
  getAllTags: async () => {
    const response = await axios.get('/tags');
    return response.data;
  },
  
  getTagById: async (id) => {
    const response = await axios.get(`/tags/${id}`);
    return response.data;
  },
  
  createTag: async (tagData) => {
    const response = await axios.post('/tags', tagData);
    return response.data;
  },
  
  updateTag: async (id, tagData) => {
    const response = await axios.patch(`/tags/${id}`, tagData);
    return response.data;
  },
  
  deleteTag: async (id) => {
    const response = await axios.delete(`/tags/${id}`);
    return response.data;
  },
  
  // Get todos with filters
  getFilteredTodos: async (filters ) => {
    const queryParams = new URLSearchParams();

    console.log("Inside get filtered todoservice", filters);
    
    // Add priority filters
    if (filters.priorities) {
      Object.entries(filters.priorities).forEach(([priority, isSelected]) => {
        if (isSelected) {
          queryParams.append('priority', priority);
        }
      });
    }
    
    // Add tag filters
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tagId => {
        queryParams.append('tags', tagId);
      });
    }

    if(filters.userId){
      console.log("Yes UserId is present yeeehhhhhhh", filters.userId);
      queryParams.append('userId', filters.userId);
    }
    
    // Add search term
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    
    // Add status filters
    if (filters.status) {
      queryParams.append('status', filters.status);
    }



    console.log("Query Params", queryParams.toString());
    const response = await axios.get(`/todos?${queryParams.toString()}`);
    return response.data;
  }
};



export default todoService;