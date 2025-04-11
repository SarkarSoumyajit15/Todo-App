import { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';
import TodoItem from './TodoItem';
import AddTodoModal from './AddTodoModal';
import TodoDetailModal from './TodoDetailModal';

const TodoList = ({ currentUser }) => {
  const { todos, filters, sortOption, setSortOption } = useTodoContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const itemsPerPage = 10;

  // Filter todos based on selected filters and search query
  const filteredTodos = todos.filter(todo => {
    // Filter by priority
    if (Object.values(filters.priorities).some(value => value)) {
      if (!filters.priorities[todo.priority]) {
        return false;
      }
    }
    
    // Filter by tags
    if (filters.tags.length > 0) {
      if (!todo.tags.some(tag => filters.tags.includes(tag.id))) {
        return false;
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      return todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             todo.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  // Sort todos
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortOption === 'date-asc') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOption === 'date-desc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === 'priority') {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedTodos.length / itemsPerPage);
  const paginatedTodos = sortedTodos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenTodoDetail = (todo) => {
    setSelectedTodo(todo);
  };

  const handleCloseTodoDetail = () => {
    setSelectedTodo(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Todo
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search todos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {paginatedTodos.length > 0 ? (
          paginatedTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onOpenDetail={() => handleOpenTodoDetail(todo)}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No todos found. Add a new todo or adjust your filters.</p>
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm">
          <button
            className="text-gray-600 flex items-center"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          
          <div className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </div>
          
          <button
            className="text-gray-600 flex items-center"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {isAddModalOpen && (
        <AddTodoModal 
          onClose={() => setIsAddModalOpen(false)} 
          currentUser={currentUser}
        />
      )}
      
      {selectedTodo && (
        <TodoDetailModal 
          todo={selectedTodo} 
          onClose={handleCloseTodoDetail}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default TodoList;