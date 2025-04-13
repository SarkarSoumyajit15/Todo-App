import axios from './axios';
// Basic tag methods
const tagService = {
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
  
  // not implemented yet

  updateTag: async (id, tagData) => {
    const response = await axios.patch(`/tags/${id}`, tagData);
    return response.data;
  },
  
  // not implemented yet
  
  deleteTag: async (id) => {
    const response = await axios.delete(`/tags/${id}`);
    return response.data;
  }
};

export default tagService;