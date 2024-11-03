import {
    CardContent,
    Typography,
    AppBar,Toolbar,Box,
    Container, Button,
   
    } from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../user/FavoriteContext';

export default function Restaurant_Detail({restaurent,loggedIn}){
     const { favorites, dispatch } = useFavorites(); 

    console.log("isloggedIn value:", loggedIn);

    const restaurantType = restaurent.type; // e.g., 'both', 'Veg', 'Non-Veg'

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
   
    const navigate = useNavigate();

    return(
        <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Restaurant Name and Favorite Button */}
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ textAlign: 'left', color: 'black' }}
                >
                    Restaurant Name: {restaurent.restaurantName}
                </Typography>

            </Box>
        <Typography
        variant="body1"
        sx={{ textAlign: 'left', marginTop: 0.5, color: 'black' }}
        >
            Category: {restaurent.category}
        </Typography>

        <Typography
        variant="body1"
        sx={{ textAlign: 'left', marginTop: 1, color: 'black' }}
        >
        {restaurent.description}
        </Typography>

        <Typography
        variant="body1"
        sx={{ textAlign: 'left', marginTop: 1, color: 'black' }}
        >
        type: {renderRestaurantType()}
        </Typography>
    </CardContent>
    );
}