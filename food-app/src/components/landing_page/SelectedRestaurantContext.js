import React, { createContext, useContext, useState } from 'react';

// Create context
const SelectedRestaurantContext = createContext();

// Provider component
export const SelectedRestaurantProvider = ({ children }) => {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    return (
        <SelectedRestaurantContext.Provider value={{ selectedRestaurant, setSelectedRestaurant }}>
            {children}
        </SelectedRestaurantContext.Provider>
    );
};

// Custom hook to use the selected restaurant context
export const useSelectedRestaurant = () => {
    return useContext(SelectedRestaurantContext);
};
