import { useState, useEffect } from "react";
import axios from 'axios';
import About from "../components/landing_page/About";
import Main_container from "../components/landing_page/Main_container";
import Restaurent_card_manager from "../components/landing_page/Restaurent_card_manager";

export default function Home() {
    const [restaurants, setRestaurants] = useState([]); // Stores all restaurant data
    const [searchTerm, setSearchTerm] = useState(""); // Track search input
    const [filterData, setFilterData] = useState('all');  // Stores filter category value
    const [displayData, setDisplayData] = useState([]); // Filtered restaurant data to display

    // Function to filter restaurants based on category
    const filterItems = (restaurants, restaurantCategory) => {
        if (!restaurantCategory || restaurantCategory === 'all') return restaurants;
        return restaurants.filter(r => r.category === restaurantCategory);
    };

    // Function to perform a combined search (by name, type, or menu item) on the frontend
    const searchRestaurants = (term) => {
        if (!term.trim()) return restaurants; // If no search term, return the full restaurant list
    
        const lowercasedTerm = term.toLowerCase();
    
        return restaurants.filter(restaurant => {
            const isVegSearch = lowercasedTerm === "veg";
            const isNonVegSearch = lowercasedTerm === "non veg" || lowercasedTerm === "non-veg";
    
            const isTypeMatch =
                (isVegSearch && (restaurant.type === "VEG" || restaurant.type === "BOTH")) ||
                (isNonVegSearch && (restaurant.type === "NON_VEG" || restaurant.type === "BOTH"));
    
            const isNameMatch = restaurant.restaurantName.toLowerCase().includes(lowercasedTerm); // Partial match for name
    
            // Return restaurant if it matches either the type (Veg, Non-Veg, Both) or name
            return isTypeMatch || isNameMatch;
        });
    };
    
    

    // Backend URL for approved restaurants
    const jsonurl = "http://localhost:8081/api/guest/approved";

    // Fetch data on component mount
    useEffect(() => {
        axios.get(jsonurl)
        .then((response) => {
            setRestaurants(response.data);  // Store fetched restaurant data
            setDisplayData(response.data);  // Set initial display data
        })
        .catch(error => {
            console.error("Error fetching the restaurant data!", error);  // Handle error
        });
    }, []);

    // Trigger search when the search term or filter changes
    useEffect(() => {
        const updateDisplayData = () => {
            if (searchTerm.trim() !== "") {
                // When search term is entered, display only the search results
                const result = searchRestaurants(searchTerm); // Filter search results in frontend
                setDisplayData(result);  // Set display data to search results only
            } else {
                // When there's no search term, display the filtered data by category
                const filteredData = filterItems(restaurants, filterData); 
                setDisplayData(filteredData); // Show filtered data (if no search term)
            }
        };
    
        updateDisplayData(); // Call the function to update display data
    }, [searchTerm, filterData, restaurants]);
    

    return (
        <div>
            <Main_container searchTerm={searchTerm} setSearchTerm={setSearchTerm} setFilterData={setFilterData} /> {/* Main banner or main section */}
            <Restaurent_card_manager 
                restaurants={displayData} 
                setFilterData={setFilterData}  // Passing filter function to update category
            />
            <About /> {/* About section */}
        </div>
    );
}
