import { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';

const Sidebar = () => {
  const { filters, setFilters } = useTodoContext();
  
  // Mock tags for filtering
  const availableTags = [
    { id: 1, name: 'work', color: 'bg-tag-work text-indigo-700' },
    { id: 2, name: 'coding', color: 'bg-tag-coding text-blue-700' },
    { id: 3, name: 'personal', color: 'bg-purple-100 text-purple-700' },
    { id: 4, name: 'health', color: 'bg-green-100 text-green-700' },
    { id: 5, name: 'shopping', color: 'bg-pink-100 text-pink-700' },
  ];

  const handlePriorityChange = (priority) => {
    const newPriorities = { ...filters.priorities };
    newPriorities[priority] = !newPriorities[priority];
    setFilters({ ...filters, priorities: newPriorities });
  };

  const handleTagChange = (tagId) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(id => id !== tagId)
      : [...filters.tags, tagId];
    setFilters({ ...filters, tags: newTags });
  };

  return (
    <aside className="w-60 bg-white p-6 shadow-sm h-[calc(100vh-64px)] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>
        
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Priority</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={filters.priorities.High}
                onChange={() => handlePriorityChange('High')}
              />
              <span className="ml-2">High</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={filters.priorities.Medium}
                onChange={() => handlePriorityChange('Medium')}
              />
              <span className="ml-2">Medium</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={filters.priorities.Low}
                onChange={() => handlePriorityChange('Low')}
              />
              <span className="ml-2">Low</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Tags</h3>
          <div className="space-y-2">
            {availableTags.map(tag => (
              <div key={tag.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`tag-${tag.id}`}
                  className="checkbox"
                  checked={filters.tags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                />
                <label htmlFor={`tag-${tag.id}`} className="ml-2 flex items-center">
                  <span className={`${tag.color} text-xs px-2 py-1 rounded-full mr-2`}>
                    {tag.name}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;