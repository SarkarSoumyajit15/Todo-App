import { useState, useRef, useEffect } from 'react';
import { useTodoContext } from '../context/TodoContext';

const TodoDetailModal = ({ todo, onClose, currentUser }) => {
  const { updateTodo } = useTodoContext();
  const [notes, setNotes] = useState(todo.notes || []);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const modalRef = useRef(null);
  
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
  
  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteObj = {
        id: Date.now(),
        text: newNote,
        createdAt: new Date().toISOString(),
        createdBy: currentUser
      };
      
      const updatedNotes = [...notes, newNoteObj];
      setNotes(updatedNotes);
      updateTodo(todo.id, { ...todo, notes: updatedNotes });
      setNewNote('');
      setIsAddingNote(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Todo Details
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
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-medium text-gray-800">{todo.title}</h3>
              <span className={`ml-3 tag ${
                todo.priority === 'High' ? 'tag-high' : 
                todo.priority === 'Medium' ? 'tag-medium' : 'tag-low'
              }`}>
                {todo.priority.toLowerCase()}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{todo.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {todo.tags.map(tag => (
                <span key={tag.id} className={`tag ${tag.color || 'bg-gray-100 text-gray-700'}`}>
                  {tag.name}
                </span>
              ))}
            </div>
            
            {todo.mentions.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Mentioned Users:</h4>
                <div className="flex flex-wrap gap-2">
                  {todo.mentions.map(user => (
                    <div key={user.id} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-4 w-4 rounded-full mr-1" 
                      />
                      @{user.username}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-sm text-gray-500 flex items-center">
              <span>Created: {formatDate(todo.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>By: {todo.createdBy.name}</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium text-gray-700">Notes</h4>
              <button 
                onClick={() => setIsAddingNote(true)}
                className="text-primary hover:text-indigo-700 text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Note
              </button>
            </div>
            
            {isAddingNote ? (
              <div className="mb-4">
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  rows="3"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                ></textarea>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setIsAddingNote(false)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-1 bg-primary text-white rounded-md hover:bg-indigo-700 text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : null}
            
            <div className="space-y-3">
              {notes.length > 0 ? (
                notes.map(note => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-700 mb-2">{note.text}</p>
                    <div className="text-xs text-gray-500 flex items-center">
                      <img 
                        src={note.createdBy.avatar} 
                        alt={note.createdBy.name} 
                        className="h-4 w-4 rounded-full mr-1" 
                      />
                      <span>{note.createdBy.name}</span>
                      <span className="mx-1">•</span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">No notes yet. Add one to keep track of progress.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetailModal;