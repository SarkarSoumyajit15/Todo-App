import { useState } from 'react';

const Header = ({ currentUser, setCurrentUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Mock users for user switching functionality
  const users = [
    { id: 1, name: 'John Doe', username: 'john_doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
    { id: 2, name: 'Jane Smith', username: 'jane_smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' },
    { id: 3, name: 'Bob Johnson', username: 'bob_johnson', avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson' },
    { id: 4, name: 'Alice Brown', username: 'alice_brown', avatar: 'https://ui-avatars.com/api/?name=Alice+Brown' },
    { id: 5, name: 'Charlie Davis', username: 'charlie_davis', avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis' },
  ];

  const handleExport = () => {
    // This will be implemented with backend integration
    alert('Export functionality will be implemented with backend integration');
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleExport}
          className="bg-gray-600 text-white px-3 py-1 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export
        </button>
        <div className="relative">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{currentUser.name}</span>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="h-8 w-8 rounded-full"
            />
          </div>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">Switch User</div>
              {users.map(user => (
                <div 
                  key={user.id}
                  className={`px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-100 cursor-pointer ${user.id === currentUser.id ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                    setCurrentUser(user);
                    setIsDropdownOpen(false);
                  }}
                >
                  <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full" />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;