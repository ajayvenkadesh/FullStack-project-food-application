import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create the FavoritesContext
const FavoriteContext = createContext();

// Reducer function to manage favorite items
const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_FAVORITES':
      const isFavorite = state.some(item => item.id === action.payload.id);
      if (isFavorite) {
        return [...state]; // Do nothing, already in favorites
      }
      const updatedFavorites = [...state, action.payload];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Persist to localStorage
      return updatedFavorites;

    case 'REMOVE_FROM_FAVORITES':
      const filteredFavorites = state.filter(item => item.id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(filteredFavorites)); // Update localStorage
      return filteredFavorites;

    default:
      return state;
  }
};

// FavoritesProvider component to wrap the application
export const FavoritesProvider = ({ children }) => {
  const [favorites, dispatch] = useReducer(favoritesReducer, [], () => {
    const localData = localStorage.getItem('favorites');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoriteContext.Provider value={{ favorites, dispatch }}>
      {children}
    </FavoriteContext.Provider>
  );
};

// Custom hook to use the FavoritesContext
export const useFavorites = () => useContext(FavoriteContext);

//check this inmorning and check app.js , add fav and restaurent folder