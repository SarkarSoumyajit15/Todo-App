import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTodoContext } from '../context/TodoContext';
import todoService from '../api/todoService';
import authService from '../api/authService';
import toast from 'react-hot-toast';

const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTodo, deleteTodo, addNote } = useTodoContext();
  
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState(null);

  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        const response = await todoService.getTodoById(id);
        if(response.statusCode == 403) {
          toast.error('You are not authorized to view this todo');
          setError('You are not authorized to view this todo');
          return;
        }
        setTodo(response?.data?.todo);
        setEditedTodo(response?.data?.todo);
      } catch (err) {
        console.error('Error fetching todo:', err);
        toast.error(err.message || 'Failed to fetch todo details');
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  useEffect(() => {
    const viewingAs = authService.isViewingAs();
    if (viewingAs) {
      setIsViewing(true);
    } else {
      setIsViewing(false);
    }
    
  }, [])
  

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      const updatedTodo = await addNote(id, noteContent);
      setTodo(updatedTodo);
      setNoteContent('');
    } catch (err) {
      setError('Failed to add note');
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const updatedTodo = await updateTodo(id, { status });
      setTodo(updatedTodo);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(id);
        navigate('/todos');
      } catch (err) {
        setError('Failed to delete todo');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTodo = await updateTodo(id, editedTodo);
      setTodo(updatedTodo);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!todo) {
    return <div>Todo not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{todo.title}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              todo.priority === 'High' ? 'bg-red-100 text-red-800' :
              todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {todo.priority}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              todo.status === 'Completed' ? 'bg-green-100 text-green-800' :
              todo.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {todo.status}
            </span>
            {todo.tags && todo.tags.map(tag => (
              <span 
                key={tag._id} 
                className="px-2 py-1 text-xs rounded-full"
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
        {!isViewing && <div className="flex space-x-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button 
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>}
      </div>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={editedTodo.title}
              onChange={(e) => setEditedTodo({...editedTodo, title: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editedTodo.description || ''}
              onChange={(e) => setEditedTodo({...editedTodo, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={editedTodo.priority}
                onChange={(e) => setEditedTodo({...editedTodo, priority: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={editedTodo.dueDate ? new Date(editedTodo.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditedTodo({...editedTodo, dueDate: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{todo.description || 'No description provided.'}</p>
          
          {todo.dueDate && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Due Date</h2>
              <p className="text-gray-700">{new Date(todo.dueDate).toLocaleDateString()}</p>
            </div>
          )}
          
          {todo.mentions && todo.mentions.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Assigned To</h2>
              <div className="flex flex-wrap gap-2">
                {todo.mentions.map(user => (
                  <div key={user._id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                      alt={user.name} 
                      className="w-5 h-5 rounded-full mr-2"
                    />
                    <span className="text-sm">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Status</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusChange('Pending')}
                className={`px-3 py-1 rounded ${
                  todo.status === 'Pending' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusChange('In Progress')}
                className={`px-3 py-1 rounded ${
                  todo.status === 'In Progress' 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange('Completed')}
                className={`px-3 py-1 rounded ${
                  todo.status === 'Completed' 
                    ? 'bg-green-700 text-white' 
                    : 'bg-green-200 text-green-700 hover:bg-green-300'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Notes</h2>
        <div className="space-y-4 mb-6">
          {todo.notes && todo.notes.length > 0 ? (
            todo.notes.map((note, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded">
                <div className="flex items-center mb-2">
                  {note.createdBy && (
                    <img 
                      src={note.createdBy.avatar || `https://ui-avatars.com/api/?name=${note.createdBy.name}`} 
                      alt={note.createdBy.name} 
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  )}
                  <span className="text-sm font-medium">
                    {note.createdBy ? note.createdBy.name : 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(note.date).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{note.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notes yet.</p>
          )}
        </div>
        
        <form onSubmit={handleAddNote} className="mt-4">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Add a note
          </label>
          <textarea
            id="note"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your note here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          ></textarea>
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!noteContent.trim()}
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoDetail;