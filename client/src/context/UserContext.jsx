import React, { createContext, useContext, useEffect, useState } from 'react'
import authService from '../api/authService';
import toast from 'react-hot-toast';
import userService from '../api/userService';

const userContext = createContext();

const UserProvider = ({children}) => {

    const [user, setUser] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [users , setUsers] = useState([]);
    const [originalUser , setOriginalUser] = useState();
    const [currentUser , setCurrentUser] = useState(null);
    const [isViewingAs , setIsViewingAs] = useState(null);

    // get current user when component mounts
    useEffect(() => {
        // check if user is authenticated
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        } else {
            setCurrentUser(null);
        }
        setLoading(false);
    }
    , []);

    // fetch all users when component mounts
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await userService.getAllUsers();
                setUsers(response?.data?.users || []);
                console.log("users", response?.data?.users || []);
            } catch (error) {
                toast.error('Failed to fetch  all users');
                console.error('Error fetching users:', error);
            }
        };
        fetchAllUsers();
    },[] ); 


    // fetch original user when component mounts
    useEffect(() => {
        const fetchOriginalUser = async () => {
            try {
                const response = await authService.getOriginalUser();
                setOriginalUser(response);
            } catch (error) {
                toast.error('Failed to fetch original user');
                console.error('Error fetching original user:', error);
            }
        };
        fetchOriginalUser();
    }
    , [currentUser],[]);


    // fetch viewing  user when component mounts
    useEffect(() => {
        const isViewingAs = authService.isViewingAs();
        if (isViewingAs) {
            setIsViewingAs(true);
        } else {
            setIsViewingAs(false);
        }
    }
    , []);


    // adding the logout funtionality
    const logout = () => {
        try {
            authService.logout();
            // clearing all states
            setCurrentUser(null);
            setOriginalUser(null);
            setIsViewingAs(false);
        } catch (error) {
            toast.error('Logout failed');
            console.error('Error logging out:', error);
        }
    }

    // login functionality
    const login = async (email,password) => {
        try {
            const response = await authService.login(email,password);
            setUser(response.data.user);
            setCurrentUser(response.data.user);
            setOriginalUser(response.data.user);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            console.error('Error logging in:', error);
        }
    }


    // fetch current user when component mounts
    const fetchCurrentUser = async () => {
        try {
            const response = await authService.getCurrentUser();
            setCurrentUser(response.data.user);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    }


    // set current user as and when required by other components
    const SetCurrentUser = async (user) => {
        try {
            const response = await authService.setCurrentUser(user);
            setCurrentUser(user);
        } catch (error) {
            console.error('Error setting current user:', error);
        }
    }


    // clear viewing as functionality   
    const clearViewingAs = () => {
        try {
            authService.clearViewingAs();
            setCurrentUser(originalUser);
        } catch (error) {
            console.error('Error clearing viewing as:', error);
        }
    }

    // set viewing as functionality
    const setViewingAs = (user) => {
        try {
            authService.setViewingAs(user);
            setCurrentUser(user);
        } catch (error) {
            console.error('Error setting viewing as:', error);
        }
    }


    

  return (
    <userContext.Provider value={{
        user,
        users,
        fetchCurrentUser,
        originalUser,
        currentUser,
        SetCurrentUser,
        clearViewingAs,
        setViewingAs,
        isViewingAs,
        login,
        logout,
    }}>
      {children}
    </userContext.Provider>
  )
}

export default UserProvider;


// Custom hook to use the user context
export const useUserContext = () => {
    const context = useContext(userContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}
