import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Typography, Box, Grid, Divider, CircularProgress } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const OrderSummary = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { restaurantEmail } = location.state || {}; // Assuming restaurantEmail will always be available

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  console.log(restaurantEmail);  // again it is showing undefined ?


  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const jwtToken = localStorage.getItem("OwnerJwtToken");
        console.log(localStorage.getItem("OwnerJwtToken"));
        if (!jwtToken) {
          setError("Authentication token missing");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8081/api/orders/restaurant/pending`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (response.data && response.data.length>0) {
          alert("order placed")
          setOrderDetails(response.data);
        } else {
          setError("No pending orders available.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err.response ? err.response.data : err.message);
        setError("Error fetching orders");
        setLoading(false);
      }
      
    };

    fetchPendingOrders();
  }, [restaurantEmail]);

  // Show loading spinner if the data is being fetched
  if (loading) {
    return <CircularProgress />;
  }

  // Show error message if there was an issue fetching the data
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Show order details if data is fetched successfully
  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Order Summary
      </Typography>
      {orderDetails.length > 0 ? (
        orderDetails.map((order) => (
          <Box key={order.orderId} mb={3}>
            <Typography variant="h6">Order ID: {order.orderId}</Typography>
            Date: {currentDate}
            {/* Conditional status color */}
            <Typography
              variant="h6"
              sx={{
                color:
                  order.status === "PENDING"
                    ? "red"
                    : order.status === "APPROVED"
                    ? "green"
                    : "red",
              }}
            >
              Status: {order.status}
            </Typography>
            <Box mt={2}>
              {order.orderedItems.map((item) => (
                <Grid container spacing={2} key={item.itemId} alignItems="center">
                  <Grid item xs={4}>
                    <Typography>{item.itemName}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>{item.quantity}</Typography>
                  </Grid>
                  <Grid xs={2}>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                   
                  </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>₹{item.price}</Typography>
                  </Grid>
                </Grid>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Total: ₹{order.totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No pending orders available.</Typography>
      )}
                     <Button
                  component={Link}
                  color="warning"
                  to="/ordersummarytable"
                  variant="contained"
                  sx={{ boxShadow: 'none', fontWeight: 'bold' }}
                >
                 Go to Order summary
                </Button>
    </Box>
  );
};

export default OrderSummary;
