import React from 'react';
import { Grid, Typography } from '@mui/material';
import Restaurent_card from "./Restaurent_card";

export default function Restaurent_card_lists({ type, restaurent }) {
    // Check if 'restaurent' is undefined or null
    if (!restaurent || restaurent.length === 0) {
        return (
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 4 }}>
                No restaurants available in this type.
            </Typography>
        );
    }

    // Filter restaurants based on the selected type (Veg or Non-Veg)
    const filteredRestaurants = type === 'all' ? restaurent : restaurent.filter(r => r.type === type);

    return (
        <Grid container spacing={3} sx={{ padding: 4 }}>
            {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map(restaurant => (
                    <Grid item xs={12} sm={6} md={3} key={restaurant.restaurantEmailId}>
                        <Restaurent_card restaurant={restaurant} />
                    </Grid>
                ))
            ) : (
                <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 4 }}>
                    No restaurants available in this type.
                </Typography>
            )}
        </Grid>
    );
}
