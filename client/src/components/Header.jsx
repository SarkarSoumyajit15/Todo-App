import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import userService from '../api/userService';
import UserSwitchModal from './UserSwitchModal';
import { useUserContext } from '../context/UserContext';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [currentUser, setCurrentUser] = useState(null);
  const [isUserSwitchModalOpen, setIsUserSwitchModalOpen] = useState(false);
  // const [isViewingAs, setIsViewingAs] = useState(false);
  const {originalUser , currentUser , SetCurrentUser , clearViewingAs,setViewingAs , isViewingAs , logout } = useUserContext();
  const navigate = useNavigate();
  

  // useEffect(() => {
  //   // Get current user from auth service
  //   console.log("Inside Header useEffect");
  //   const user = authService.getCurrentUser();
  //   if (user) {
  //     setCurrentUser(user);
  //   }
  //   // Check if the user is in viewingAs mode
  //   const viewingAs = authService.isViewingAs();
  //   if (viewingAs) {
  //     setIsViewingAs(true);
  //   } else {
  //     setIsViewingAs(false);
  //   }
  // }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExport = async () => {
    try {
      const response = await userService.exportTodos();
      
      // Create a download link for the exported file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'todos.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export todos:', error);
      alert('Failed to export todos. Please try again.');
    }
  };
  
  const handleUserSwitch = (user) => {
    console.log("Inside handleUserSwitch");
    console.log("user", user);
    // console.log("currentUser", currentUser);

    if (!user) {
      // Return to original user
      // const originalUser = authService.getOriginalUser();
      if (originalUser) {
        SetCurrentUser(originalUser);
        clearViewingAs();
        // SetCurrentUser(originalUser);
      }
    } else if (currentUser?._id !== user?._id) {
      // Switch to another user

      SetCurrentUser(user);
      console.log("checking original usr id and user id", user?._id.toString()+ " :  "+ originalUser?._id.toString());

      // If it is changed to Original User, clear the viewingAs flag
      if (user?._id.toString() === originalUser?._id.toString()) {
        console.log("Switching to original user");
        clearViewingAs();
      } else {
        console.log("Switching to another user");
        setViewingAs(user);
      }
      
    }
    
    setIsUserSwitchModalOpen(false);
    // Refresh the page to update the UI with the new user context
    window.location.reload();
  };

  if (!currentUser) {
    return <div className="bg-white shadow-sm py-4 px-6">Loading...</div>;
  }

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
      <div className="flex items-center space-x-4">
        {isViewingAs && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
            Viewing Mode
          </div>
        )}
        
        <button 
          onClick={() => setIsUserSwitchModalOpen(true)}
          className="bg-gray-600 text-white px-3 py-1 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Switch User
        </button>
        
        {!isViewingAs && (
          <button 
            onClick={handleExport}
            className="bg-gray-600 text-white px-3 py-1 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export
          </button>
        )}
        
        <div className="relative">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{currentUser.name}</span>
            <img 
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`} 
              alt={currentUser.name} 
              className="h-8 w-8 rounded-full"
            />
          </div>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              {!isViewingAs && (
                <div 
                  className="px-4 py-2 text-sm flex items-center hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/profile');
                    setIsDropdownOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Profile
                </div>
              )}
              <div 
                className="px-4 py-2 text-sm flex items-center hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 3a1 1 0 10-2 0v6.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L14 12.586V6z" clipRule="evenodd" />
                </svg>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isUserSwitchModalOpen && (
        <UserSwitchModal 
          onClose={() => setIsUserSwitchModalOpen(false)}
          onUserSwitch={handleUserSwitch}
          currentUser={currentUser}
        />
      )}
    </header>
  );
};

export default Header;