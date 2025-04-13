import { useState, useEffect, useRef } from 'react';
import { useTodoContext } from '../context/TodoContext';
import { useTagContext } from '../context/TagContext';

const AddTodoModal = ({ onClose, currentUser, isEditing = false, todo = null }) => {
  const { addTodo, updateTodo, users ,  } = useTodoContext();
  const { createTag , tags } = useTagContext();
  
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [dueDate, setDueDate] = useState(todo?.dueDate || '');
  const [priority, setPriority] = useState(todo?.priority || 'Medium');
  const [selectedTags, setSelectedTags] = useState(todo?.tags?.map(tag => tag._id) || []);
  
  // For new tag creation
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#e0e0e0');
  const [showTagForm, setShowTagForm] = useState(false);
  
  const [mentionText, setMentionText] = useState('');
  const [mentions, setMentions] = useState(todo?.mentions || []);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  
  const modalRef = useRef(null);
  
  // Filter users based on mention text
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(mentionText.toLowerCase()) ||
    user.name.toLowerCase().includes(mentionText.toLowerCase())
  );
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  const handleAddMention = (user) => {
    if (!mentions.some(m => m._id === user._id)) {
      setMentions([...mentions, user]);
    }
    setMentionText('');
    setShowMentionSuggestions(false);
  };
  
  const handleRemoveMention = (userId) => {
    setMentions(mentions.filter(mention => mention._id !== userId));
  };
  
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      // Assuming your TodoContext has a createTag function
      const newTag = await createTag({
        name: newTagName.trim(),
        color: newTagColor
      });
      
      // Add the new tag to selected tags
      setSelectedTags([...selectedTags, newTag._id]);
      
      // Reset form
      setNewTagName('');
      setNewTagColor('#e0e0e0');
      setShowTagForm(false);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const todoData = {
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
      tags: selectedTags, // Just send the tag IDs
      mentions: mentions.map(user => user._id), // Just send the user IDs
    };
    
    if (isEditing && todo?._id) {
      updateTodo(todo._id, todoData);
    } else {
      addTodo(todoData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditing ? 'Edit Todo' : 'Add New Todo'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <div className="flex space-x-4">
                {['High', 'Medium', 'Low'].map((p) => (
                  <label key={p} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={priority === p}
                      onChange={() => setPriority(p)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{p}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags && tags.map(tag => (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => handleTagToggle(tag._id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag._id)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    style={selectedTags.includes(tag._id) ? {
                      backgroundColor: tag.color || '#e0e0e0',
                      color: tag.textColor || '#000000'
                    } : {}}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div> */}
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <button
                  type="button"
                  onClick={() => setShowTagForm(!showTagForm)}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  {showTagForm ? 'Cancel' : '+ New Tag'}
                </button>
              </div>
              
              {showTagForm && (
                <div className="mb-3 p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Tag name"
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                    />
                    <input
                      type="color"
                      className="h-8 w-8 border-0 p-0 cursor-pointer"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="w-full px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
                  >
                    Create Tag
                  </button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {tags && tags.map(tag => (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => handleTagToggle(tag._id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag._id)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    style={selectedTags.includes(tag._id) ? {
                      backgroundColor: tag.color || '#e0e0e0',
                      color: tag.textColor || '#000000'
                    } : {}}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mention Users
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type @ to mention users"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={mentionText}
                  onChange={(e) => {
                    setMentionText(e.target.value);
                    setShowMentionSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => {
                    if (mentionText.length > 0) {
                      setShowMentionSuggestions(true);
                    }
                  }}
                />
                
                {showMentionSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <div
                          key={user.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleAddMention(user)}
                        >
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="h-6 w-6 rounded-full mr-2" 
                          />
                          <div>
                            <div className="text-sm font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {mentions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {mentions.map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm"
                    >
                      @{user.username}
                      <button
                        type="button"
                        className="ml-1 text-blue-500 hover:text-blue-700"
                        onClick={() => handleRemoveMention(user.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;