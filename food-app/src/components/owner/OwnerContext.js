import React, { createContext, useContext, useState } from 'react';

// Create a UserContext
const OwnerContext = createContext();

// UserProvider component to provide the user state to children
export const OwnerProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);

  return (
    <OwnerContext.Provider value={{ owner, setOwner }}>
      {children}
    </OwnerContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
