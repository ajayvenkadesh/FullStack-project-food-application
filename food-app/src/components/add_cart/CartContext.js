import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from '../user/UserContext'; 

// Create the CartContext
const CartContext = createContext();

// Custom hook to use the CartContext
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [openError, setOpenError] = useState(false); // Controls if Snackbar is open
  const [errorMsg, setErrorMsg] = useState(""); // Stores the error message

  const { user } = useUser();
  const userEmail = user ? user.emailId : '';

  // Function to fetch cart details
  const fetchCartDetails = async () => {
    if (!userEmail) return; // Return early if userEmail is not available

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/add-cart/cart-details", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setCartItems(response.data); // Set the actual list of cart items
      setError(null);
    } catch (err) {
      setError(err.response?.data || "Error fetching cart details.");
    } finally {
      setLoading(false);
    }
  };

  // Function to add an item to the cart or increase its quantity
  const addToCart = async (menuItem) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/add-cart/add-productToCart",
        menuItem,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setMessage("Item added to cart successfully.");
      setOpenError(false); // Ensure no error snackbar is open on success
      fetchCartDetails(); // Refetch cart details after adding an item
      return true; // Return success
    } catch (err) {
      setMessage(err.response?.data || "Error adding item to cart.");
      setErrorMsg(err.response?.data || "Error adding item to cart.");
      setOpenError(true); // Trigger the Snackbar to show the error
      return false; // Return failure
    }
  };
  

  // Function to remove an item from the cart
  const removeFromCart = async (id) => {
    if (!userEmail) return;
    try {
      const response = await fetch(`http://localhost:8081/api/add-cart/removeItem/${userEmail}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      setMessage('Item removed from cart successfully.');
      fetchCartDetails(); // Refetch the cart details to update the frontend state
    } catch (error) {
      setMessage(error.message || 'Error removing item from cart.');
    }
  };

  // Function to increase quantity of an item
  const increaseQuantity = async (id) => {
    if (!userEmail) return;
    try {
      await axios.put(`http://localhost:8081/api/add-cart/increaseQuantity/${userEmail}/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setMessage('Quantity increased successfully.');
      fetchCartDetails(); // Refetch cart details after increasing quantity
    } catch (err) {
      setMessage(err.response?.data || "Error increasing item quantity.");
    }
  };

  // Function to decrease quantity of an item
  const decreaseQuantity = async (id) => {
    if (!userEmail) return;
    try {
      await axios.put(`http://localhost:8081/api/add-cart/decreaseQuantity/${userEmail}/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setMessage('Quantity decreased successfully.');
      fetchCartDetails(); // Refetch cart details after decreasing quantity
    } catch (err) {
      setMessage(err.response?.data || "Error decreasing item quantity.");
    }
  };

  // Function to clear the cart
  const clearCart = async () => {
    if (!userEmail) return;
    try {
      await axios.put(
        `http://localhost:8081/api/add-cart/clearCart/${userEmail}`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setMessage("Cart cleared successfully.");
      setCartItems([]); // Clear cart items from local state
    } catch (err) {
      setMessage(err.response?.data || "Error clearing cart.");
    }
  };

  // Fetch cart details when the component mounts
  useEffect(() => {
    if (userEmail) {
      fetchCartDetails();
    }
  }, [userEmail]); // Adding userEmail as a dependency

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        message,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,openError,      // Expose openError for Snackbar
        errorMsg,       // Expose errorMsg for Snackbar
        setOpenError,   // Expose setOpenError for Snackbar control
        setErrorMsg     // Expose setErrorMsg for error message updates
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
