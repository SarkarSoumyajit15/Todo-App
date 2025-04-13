import { useState, useEffect, useRef } from 'react';
import userService from '../api/userService';
import { useUserContext } from '../context/UserContext';

const UserSwitchModal = ({ onClose, onUserSwitch, currentUser }) => {

  const {users} = useUserContext();
  console.log("users in switch", users);
  // const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef(null);
  
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await userService.getAllUsers();
  //       setUsers(response.data.users || []);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Failed to fetch users:', error);
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchUsers();
  // }, []);
  
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
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Switch User
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
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No users found</p>
              ) : (
                filteredUsers.map(user => (
                  <div 
                    key={user._id}
                    className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-100 ${
                      currentUser && user._id === currentUser._id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => onUserSwitch(user)}
                  >
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                      alt={user.name} 
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      {user.username && (
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      )}
                    </div>
                    {currentUser && user._id === currentUser._id && (
                      <span className="ml-auto text-xs bg-primary text-white px-2 py-1 rounded">Current</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          
          {currentUser && currentUser.viewingAs && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => onUserSwitch(null)}
                className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Return to My Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSwitchModal;