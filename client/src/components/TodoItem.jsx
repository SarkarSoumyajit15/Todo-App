import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTodoContext } from '../context/TodoContext';
import authService from '../api/authService';

const TodoItem = ({ todo }) => {
  const { toggleTodoComplete, deleteTodo } = useTodoContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewingAs, setIsViewingAs] = useState(false);

  useEffect(() => {
    const isViewing = authService.isViewingAs();
    if (isViewing) {
      setIsViewingAs(true);
    } else {
      setIsViewingAs(false);
    }

  }, []);
  

  const handleToggleComplete = async (e) => {
    e.preventDefault();
    try {
      await toggleTodoComplete(todo._id, !todo.completed);
    } catch (err) {
      console.error('Failed to toggle todo status:', err);
    }
  };


  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTodo(todo._id);
      } catch (err) {
        console.error('Failed to delete todo:', err);
        setIsDeleting(false);
      }
    }
  };

  // Format date if it exists
  const formattedDate = todo.dueDate 
    ? new Date(todo.dueDate).toLocaleDateString() 
    : null;

  return (
    <Link to={`/todos/${todo._id}`} className="block">
      <div className={`bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow ${isDeleting ? 'opacity-50' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {!isViewingAs && <div className="pt-1">
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={handleToggleComplete}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                onClick={(e) => e.stopPropagation()}
              />
            </div>}
            <div>
              <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {todo.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center mt-2 gap-2">
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  todo.priority === 'High' ? 'bg-red-100 text-red-800' :
                  todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {todo.priority}
                </span>
                
                {todo.status && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    todo.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    todo.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {todo.status}
                  </span>
                )}
                
                {formattedDate && (
                  <span className="text-xs text-gray-500">
                    Due: {formattedDate}
                  </span>
                )}
                
                {todo.tags && todo.tags.map(tag => (
                  <span 
                    key={tag._id} 
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{ 
                      backgroundColor: tag.color || '#e0e0e0',
                      color: tag.textColor || '#000000'
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500"
            disabled={isDeleting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default TodoItem;