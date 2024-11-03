import React, { createContext, useContext, useState } from 'react';

// Create a UserContext
const UserContext = createContext();

// UserProvider component to provide the user state to children
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserImageFileName, setCurrentUserImageFileName] = useState('');

  return (
    <UserContext.Provider value={{ user, setUser,currentUsername, setCurrentUsername, currentUserImageFileName, setCurrentUserImageFileName }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
