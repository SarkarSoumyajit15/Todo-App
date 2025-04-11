import { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';

const TodoItem = ({ todo, onOpenDetail, currentUser }) => {
  const { toggleTodoComplete, deleteTodo } = useTodoContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleToggleComplete = (e) => {
    e.stopPropagation();
    toggleTodoComplete(todo.id);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    deleteTodo(todo.id);
    setIsMenuOpen(false);
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    onOpenDetail();
    setIsMenuOpen(false);
  };
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'tag-high';
      case 'Medium': return 'tag-medium';
      case 'Low': return 'tag-low';
      default: return '';
    }
  };

  return (
    <div 
      className={`todo-item flex items-start ${todo.completed ? 'opacity-60' : ''}`}
      onClick={onOpenDetail}
    >
      <input
        type="checkbox"
        className="checkbox mt-1"
        checked={todo.completed}
        onChange={handleToggleComplete}
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="ml-3 flex-1">
        <div className="flex justify-between">
          <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.title}
          </h3>
          
          <div className="relative">
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-1 flex flex-wrap gap-1">
          <span className={`tag ${getPriorityClass(todo.priority)}`}>
            {todo.priority.toLowerCase()}
          </span>
          
          {todo.tags.map(tag => (
            <span key={tag.id} className={`tag ${tag.color || 'bg-gray-100 text-gray-700'}`}>
              {tag.name}
            </span>
          ))}
          
          {todo.mentions.map(mention => (
            <span key={mention.id} className="tag bg-blue-50 text-blue-700">
              @{mention.username}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;