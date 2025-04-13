import { createContext, useContext, useState, useEffect } from 'react';
import todoService from '../api/todoService';
import userService from '../api/userService';
import authService from '../api/authService';
import tagService from '../api/tagService';
import { toast } from 'react-hot-toast';
import { useUserContext } from './UserContext';



// Create context
const TodoContext = createContext();

// Context provider component
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  // const [users, setUsers] = useState([]);
  const {user} = useUserContext();
  const [tags, setTags] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    userId:null,
    priorities: { High: false, Medium: false, Low: false },
    tags: [],
    search: '',
  });
  
  // Fetch data on component mount
  // Update the useEffect in TodoContext.jsx
  
  useEffect(() => {
    console.log("Inside TodoContextProvider useEffect");
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        // const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          
          // Set the user ID in filters
          setFilters(prevFilters => ({
            ...prevFilters,
            userId: user._id
          }));
          
          // Fetch todos based on current user
          const todosResponse = await todoService.getAllTodos();
          // const usersResponse = await userService.getAllUsers();
          // const tagsResponse = await tagService.getAllTags();
          
          setTodos(todosResponse.data.todos || []);
          // setUsers(usersResponse.data.users || []);
          // setTags(tagsResponse.data.tags || []);
        }
        
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || 'An error occurred');
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Add todo
  // In your TodoContext.jsx, add this check before any write operations
  
  // Update the isViewingMode check
  const isViewingMode = authService.isViewingAs();
  
  // Then in functions like addTodo, updateTodo, deleteTodo, etc.
  const addTodo = async (todoData) => {
    if (isViewingMode) {
      alert('You cannot create todos while viewing another user\'s account');
      return;
    }
    
    try {
      const response = await todoService.createTodo(todoData);
      setTodos([...todos, response.data.todo]);
      toast.success('Todo added successfully!');
      return response.data.todo;
    } catch (err) {
      
      toast.error(err.response?.data?.message || 'Failed to add todo');
      setError(err.response?.data?.message || 'Failed to add todo');

      throw err;
    }
  };
  
  // Update todo
  const updateTodo = async (id, todoData) => {
    if (isViewingMode) {
      alert('You cannot update todos while viewing another user\'s account');
      return;
    }
    
    try {
      const response = await todoService.updateTodo(id, todoData);
      setTodos(todos.map(todo => todo._id === id ? response.data.todo : todo));
      toast.success('Todo updated successfully!');
      return response.data.todo;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update todo');
      setError(err.response?.data?.message || 'Failed to update todo');
      throw err;
    }
  };
  
  // Delete todo
  const deleteTodo = async (id) => {
    if (isViewingMode) {
      alert('You cannot delete todos while viewing another user\'s account');
      return;
    }
    
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
      toast.success('Todo deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete todo');
      setError(err.response?.data?.message || 'Failed to delete todo');
      throw err;
    }
  };

  
  // Add note to todo
  const addNote = async (todoId, noteContent) => {
    try {
      const response = await todoService.addNote(todoId, noteContent);
      setTodos(todos.map(todo => todo._id === todoId ? response.data.todo : todo));
      toast.success('Note added successfully!');
      return response.data.todo;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add note');
      // setError(err.response?.data?.message || 'Failed to add note');
      throw err;
    }
  };
  
  // Toggle todo completion
  const toggleTodoComplete = async (id, completed) => {
    try {
      const response = await todoService.toggleComplete(id, completed);
      setTodos(todos.map(todo => todo._id === id ? response.data.todo : todo));
      return response.data.todo;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo status');
      throw err;
    }
  };
  
  // Get filtered todos
  const getFilteredTodos = async () => {
    try {
      // If no filters are active, return the current todos
      const noFiltersActive = 
        !Object.values(filters.priorities).some(value => value) && 
        filters.tags.length === 0 && 
        !filters.search;
      
      if (noFiltersActive) {
        return todos;
      }
      
      // Otherwise, fetch filtered todos from the API
      console.log("Inside get filtered todos",filters.userId);
      const response = await todoService.getFilteredTodos(filters);
      return response.data.todos || [];
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch filtered todos');
      // setError(err.response?.data?.message || 'Failed to fetch filtered todos');
      return todos;
    }
  };


  
  return (
    <TodoContext.Provider value={{
      todos,
      currentUser,
      loading,
      error,
      filters,
      setFilters,
      addTodo,
      updateTodo,
      deleteTodo,
      addNote,
      toggleTodoComplete,
      getFilteredTodos,
    }}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the todo context
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};