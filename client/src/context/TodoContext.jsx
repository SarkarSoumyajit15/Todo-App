import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const TodoContext = createContext();

// Custom hook to use the todo context
export const useTodoContext = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
  // Initial mock data for todos
  const initialTodos = [
    {
      id: 1,
      title: 'Complete the todo app assignment',
      description: 'Implement all required features for the todo application',
      priority: 'High',
      tags: [
        { id: 1, name: 'work', color: 'bg-tag-work text-indigo-700' },
        { id: 2, name: 'coding', color: 'bg-tag-coding text-blue-700' }
      ],
      mentions: [
        { id: 5, name: 'Charlie Davis', username: 'charlie_davis', avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis' }
      ],
      completed: false,
      createdAt: '2023-05-15T10:30:00Z',
      createdBy: { id: 1, name: 'John Doe', username: 'john_doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
      notes: [
        {
          id: 101,
          text: 'Started working on the frontend components',
          createdAt: '2023-05-16T14:20:00Z',
          createdBy: { id: 1, name: 'John Doe', username: 'john_doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' }
        }
      ]
    },
    {
      id: 2,
      title: 'Design the database schema',
      description: 'Create MongoDB schema for the todo application',
      priority: 'Medium',
      tags: [
        { id: 2, name: 'coding', color: 'bg-tag-coding text-blue-700' }
      ],
      mentions: [],
      completed: true,
      createdAt: '2023-05-14T09:15:00Z',
      createdBy: { id: 1, name: 'John Doe', username: 'john_doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
      notes: []
    },
    {
      id: 3,
      title: 'Implement user authentication',
      description: 'Add user login and registration functionality',
      priority: 'Low',
      tags: [
        { id: 1, name: 'work', color: 'bg-tag-work text-indigo-700' },
        { id: 3, name: 'personal', color: 'bg-purple-100 text-purple-700' }
      ],
      mentions: [
        { id: 2, name: 'Jane Smith', username: 'jane_smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' }
      ],
      completed: false,
      createdAt: '2023-05-13T15:45:00Z',
      createdBy: { id: 1, name: 'John Doe', username: 'john_doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
      notes: []
    }
  ];

  // State
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : initialTodos;
  });
  
  const [filters, setFilters] = useState({
    priorities: { High: false, Medium: false, Low: false },
    tags: []
  });
  
  const [sortOption, setSortOption] = useState('date-desc');

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = (todoData) => {
    const newTodo = {
      id: Date.now(),
      ...todoData
    };
    setTodos([newTodo, ...todos]);
  };

  // Update an existing todo
  const updateTodo = (id, updatedData) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updatedData } : todo
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

  // Context value
  const value = {
    todos,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};