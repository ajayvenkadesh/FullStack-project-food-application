import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material'; 
import { Link } from "react-router-dom";

import { useSelectedRestaurant } from "./SelectedRestaurantContext"

export default function Restaurent_card({ restaurant }) {

    const { setSelectedRestaurant } = useSelectedRestaurant(); // Use the context

    const handleViewRestaurant = () => {
        try {
          setSelectedRestaurant(restaurant.restaurantName); // Store selected restaurant name
          console.log("Selected Restaurant:", restaurant.restaurantName); // Log the selected restaurant name
        } catch (error) {
          console.error("Error setting selected restaurant:", error); // Log any error
        }
      };

  console.log("Restaurant data in card:", restaurant);

  const restaurantType = restaurant.type; // e.g., 'both', 'Veg', 'Non-Veg'

// Function to render the restaurant type
const renderRestaurantType = () => {
  if (restaurantType === 'BOTH') {
    return <span>Veg / Non-Veg</span>; // Display both types
  } else if (restaurantType === 'VEG') {
    return <span>Veg</span>; // Display Veg only
  } else if (restaurantType === 'NON_VEG') {
    return <span>Non-Veg</span>; // Display Non-Veg only
  } else {
    return <span>No description available.</span>; // Fallback message
  }
};

    return (
        <Card sx={{ maxWidth: 345, marginLeft: 2 }}>
            <CardMedia
                sx={{ height: 200 }}
                component="img"
                image={`http://localhost:8081/api/images/restaurant/${restaurant.restaurantEmailId}/${restaurant.restaurantImageFileName || 'defaultImage.jpg'}`}  // Fallback image if not available
                alt={restaurant.name || "Restaurant Image"}
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div" sx={{ color: 'black' }}>
                    {restaurant.restaurantName || "Restaurant Name"}
                </Typography>
                <Typography sx={{ fontSize: 15, marginTop: -1, color: 'black' }} gutterBottom variant="h6">
                {renderRestaurantType()}
                </Typography>
            </CardContent>
            <CardActions style={{ backgroundColor: '#F9A01A', justifyContent: 'center', padding: 0, marginTop: '-0.5vh' }}>
            <Link to={`/restaurants/menu/${restaurant.restaurantEmailId}`} state={{ restaurent: restaurant }} onClick={handleViewRestaurant}>
                    <Button
                        sx={{
                            marginTop: -0.5, paddingRight: 10, paddingLeft: 10, paddingTop: 1, color: 'white',
                            fontWeight: 'bold',
                        }}
                        size="small"
                    >
                        View Restaurant
                    </Button>
                </Link>
            </CardActions>
        </Card>
    );
}
