import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TodoContext = createContext();

// Mock users data
const mockUsers = [
  { id: '1', username: 'john_doe', name: 'John Doe', email: 'john@example.com', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', username: 'jane_smith', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', username: 'alex_wilson', name: 'Alex Wilson', email: 'alex@example.com', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '4', username: 'emily_brown', name: 'Emily Brown', email: 'emily@example.com', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', username: 'michael_davis', name: 'Michael Davis', email: 'michael@example.com', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
];

// Mock tags data
const mockTags = [
  { id: '1', name: 'Work', color: '#FF5733', textColor: '#FFFFFF' },
  { id: '2', name: 'Personal', color: '#33FF57', textColor: '#000000' },
  { id: '3', name: 'Urgent', color: '#FF3333', textColor: '#FFFFFF' },
  { id: '4', name: 'Later', color: '#3357FF', textColor: '#FFFFFF' },
  { id: '5', name: 'Ideas', color: '#F3FF33', textColor: '#000000' },
];

export const TodoProvider = ({ children }) => {
  // Initialize todos from localStorage or use mock data
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [];
  });
  
  // Initialize users from localStorage or use mock data
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return mockUsers;
  });
  
  // Initialize tags from localStorage or use mock data
  const [tags, setTags] = useState(() => {
    const savedTags = localStorage.getItem('tags');
    if (savedTags) {
      return JSON.parse(savedTags);
    }
    return mockTags;
  });
  
  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  
  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);
  
  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);
  
  // Filter state
  const [filters, setFilters] = useState({
    priorities: {
      Low: false,
      Medium: false,
      High: false
    },
    tags: []
  });
  
  // Sort option state
  const [sortOption, setSortOption] = useState('date-desc');
  
  // Add a new todo
  const addTodo = (todo) => {
    const newTodo = {
      ...todo,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      completed: false
    };
    setTodos([...todos, newTodo]);
  };
  
  // Update an existing todo
  const updateTodo = (updatedTodo) => {
    setTodos(todos.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
  };
  
  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Toggle todo completion status
  const toggleTodoComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // Add a new user
  const addUser = (user) => {
    const newUser = {
      ...user,
      id: uuidv4()
    };
    setUsers([...users, newUser]);
  };
  
  // Update an existing user
  const updateUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };
  
  // Delete a user
  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };
  
  // Add a new tag
  const addTag = (tag) => {
    const newTag = {
      ...tag,
      id: uuidv4()
    };
    setTags([...tags, newTag]);
  };
  
  // Update an existing tag
  const updateTag = (updatedTag) => {
    setTags(tags.map(tag => 
      tag.id === updatedTag.id ? updatedTag : tag
    ));
  };
  
  // Delete a tag
  const deleteTag = (id) => {
    setTags(tags.filter(tag => tag.id !== id));
  };
  
  return (
    <TodoContext.Provider value={{
      todos,
      users,
      tags,
      filters,
      setFilters,
      sortOption,
      setSortOption,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodoComplete,
      addUser,
      updateUser,
      deleteUser,
      addTag,
      updateTag,
      deleteTag
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => useContext(TodoContext);