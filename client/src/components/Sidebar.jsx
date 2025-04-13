import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTodoContext } from '../context/TodoContext';
import todoService from '../api/todoService';
import AddTodoModal from './AddTodoModal';
import tagService from '../api/tagService';
import authService from '../api/authService';
import { useTagContext } from '../context/TagContext';

const Sidebar = () => {
  const { filters, setFilters } = useTodoContext();
  // const [tags, setTags] = useState([]);
  const { tags, setTags , fetchTags } = useTagContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewingAs, setIsViewingAs] = useState(false);
  
  // useEffect(() => {
  //   const fetchTags = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetchTags();
  //       setTags(response.data.tags || []);
  //       setLoading(false);
  //     } catch (err) {
  //       setError('Failed to load tags');
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchTags();
  // }, []);

  useEffect(() => {
    const viewingAs = authService.isViewingAs();
    if (viewingAs) {
      setIsViewingAs(true);
    } else {
      setIsViewingAs(false);
    }
  
    
  }, [])
  
  
  const handlePriorityChange = (priority) => {
    setFilters({
      ...filters,
      priorities: {
        ...filters.priorities,
        [priority]: !filters.priorities[priority]
      }
    });
  };
  
  const handleTagChange = (tagId) => {
    if (filters.tags.includes(tagId)) {
      setFilters({
        ...filters,
        tags: filters.tags.filter(id => id !== tagId)
      });
    } else {
      setFilters({
        ...filters,
        tags: [...filters.tags, tagId]
      });
    }
  };
  
  const clearFilters = () => {
    setFilters({
      priorities: { High: false, Medium: false, Low: false },
      tags: [],
      search: ''
    });
  };
  
  return (
    <aside className="w-64 bg-white shadow-sm h-full overflow-y-auto">
      <div className="p-4">
        {/* Add Create Task button at the top */}
        {!isViewingAs && <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full mb-4 bg-primary text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-dark transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Task
        </button>}
        
        <nav className="space-y-1">
          {/* Existing navigation links */}
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </div>
          </NavLink>
          {/* Rest of the navigation */}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Filters</h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Priority</h4>
          <div className="space-y-1">
            {['High', 'Medium', 'Low'].map(priority => (
              <label key={priority} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={filters.priorities[priority]}
                  onChange={() => handlePriorityChange(priority)}
                />
                <span className="ml-2 text-sm text-gray-700">{priority}</span>
              </label>
            ))}
          </div>
        </div>
        
        {tags.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Tags</h4>
            <div className="space-y-1">
              {tags.map(tag => (
                <label key={tag._id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={filters.tags.includes(tag._id)}
                    onChange={() => handleTagChange(tag._id)}
                  />
                  <span 
                    className="ml-2 text-sm px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: tag.color || '#e0e0e0',
                      color: tag.textColor || '#000000'
                    }}
                  >
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {(Object.values(filters.priorities).some(v => v) || filters.tags.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:text-primary-dark"
          >
            Clear all filters
          </button>
        )}
      </div>
      
      {/* Add this at the end of the component to render the modal when isAddModalOpen is true */}
      {isAddModalOpen && (
        <AddTodoModal 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}
    </aside>
  );
};

export default Sidebar;