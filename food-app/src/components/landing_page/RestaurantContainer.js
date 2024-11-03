// import React, { useState, useEffect } from "react";
// import { Grid } from "@mui/material";
// import axios from "axios";
// import SearchBar from "./SearchBar"; // Adjust the path according to your structure
// import Restaurent_card from "./Restaurent_card"; // Adjust the path according to your structure

// export default function RestaurantContainer() {
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]); // State to hold filtered results
//   const [allRestaurants, setAllRestaurants] = useState([]); // State to hold all restaurants

//   useEffect(() => {
//     const fetchAllRestaurants = async () => {
//       try {
//         const response = await axios.get("http://localhost:8081/api/guest/approved"); // Adjust the API URL if needed
//         setAllRestaurants(response.data); // Store all restaurants
//       } catch (error) {
//         console.error("Error fetching restaurants", error);
//       }
//     };

//     fetchAllRestaurants();
//   }, []);

//   const restaurantsToShow = filteredRestaurants.length > 0 ? filteredRestaurants : allRestaurants;

//   return (
//     <div>
//       {/* Pass setFilteredRestaurants to SearchBar */}
//       <SearchBar setFilteredRestaurants={setFilteredRestaurants} />

//       {/* Render restaurant cards */}
//       <Grid container spacing={2} style={{ marginTop: '20px' }}>
//         {restaurantsToShow.length > 0 ? (
//           restaurantsToShow.map((restaurant) => (
//             <Grid item key={restaurant.restaurantEmailId} xs={12} sm={6} md={4} lg={3}>
//               <Restaurent_card restaurant={restaurant} />
//             </Grid>
//           ))
//         ) : (
//           <p>No results found</p>
//         )}
//       </Grid>
//     </div>
//   );
// }
