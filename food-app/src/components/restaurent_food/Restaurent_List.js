import { 
  CardContent,
  Card,
  Typography,
  CardMedia,
  Grid,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useCart } from '../add_cart/CartContext';
import { useNavigate } from 'react-router-dom'; 
import { useContext, useState } from 'react';
import { categoryContext } from '../../App';

export default function Restaurent_List({ menu, restaurent }) {
  const { isLoggedIn } = useContext(categoryContext);
  const { addToCart, openError, errorMsg, setOpenError } = useCart(); // Access errorMsg and setOpenError from CartContext
  const navigate = useNavigate();
  const [openSuccess, setOpenSuccess] = useState(false);

  const foodItems = menu;
  

  const handleOrderNow = async (foodItem) => {
    if (isLoggedIn) {
      const success = await addToCart(foodItem);
      if (success) {
        setOpenSuccess(true);
      }
    } else {
      navigate('/login', { state: { from: `/restaurent/${restaurent.restaurantEmailId}` } });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false); // Close the error Snackbar
  };

  return (
    <div>
      <Grid container spacing={1} mb={5}>
        {foodItems.map((foodItem, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ margin: 1 }}>
              <CardMedia
                sx={{ height: 200 }}
                component="img"
                image={`http://localhost:8081/api/images/menu/${foodItem.restaurantEmailId}/${foodItem.menuImageFileName}` || '/defaultImage.jpg'}
                alt={foodItem.itemName}
              />
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {foodItem.itemName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {foodItem.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Price: ₹{foodItem.price} | Available: {foodItem.availableCount}
                </Typography>

                {foodItem.availableCount > 0 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ backgroundColor: '#F9A01A', mt: 2 }}
                    onClick={() => handleOrderNow(foodItem)}
                  >
                    Add To Cart
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2 }}
                    disabled
                  >
                    Currently unavailable
                  </Button>
                )}

                {/* Snackbar for Success */}
                <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Food added to Cart successfully
                  </Alert>
                </Snackbar>

                {/* Snackbar for Error */}
                <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
                  <Alert onClose={handleCloseError} severity="error" variant="filled" sx={{ width: '100%' }}>
                    {errorMsg} {/* Display the error message */}
                  </Alert>
                </Snackbar>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
