import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from '@mui/material';
import axios from 'axios';

const OrderSummaryTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        console.log(jwtToken);
        const userEmailId = localStorage.getItem("emailId"); // Assuming email is stored in localStorage
        console.log(userEmailId);

        if (!jwtToken || !userEmailId) {
          setError("Authentication or email missing");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8081/api/orders/user/${userEmailId}`, // Include userEmailId in URL
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        if (response.data && response.data.length > 0) {
          setOrders(response.data);
        } else {
          setError("No orders found.");
        }
        setLoading(false);
      } catch (err) {
        setError("No orders found.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box padding={3}>
      <Typography sx={{ fontFamily: 'cursive' }} variant="h3" gutterBottom>
        Order Summary
      </Typography>
      <TableContainer component={Paper} >
        <Table>
          <TableHead sx={{ marginBottom: 2, padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Restaurant</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Total</TableCell>
              {/* <TableCell>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor:
                        order.status === 'PENDING'
                          ? 'orange'
                          : order.status === 'APPROVED'
                          ? 'green'
                          : 'red',
                      color: 'white',
                      '&:hover': {
                        backgroundColor:
                          order.status === 'PENDING'
                            ? 'darkorange'
                            : order.status === 'APPROVED'
                            ? 'darkgreen'
                            : 'darkred',
                      },
                    }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Button>
                </TableCell>
                <TableCell>{order.restaurantName}</TableCell>
                <TableCell>
                  {order.orderedItems.map((item) => (
                    <div key={item.itemId}>
                      {item.itemName}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {order.orderedItems.map((item) => (
                    <div key={item.itemId}>
                      {item.quantity}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                      {currentDate}
                </TableCell>
                <TableCell>{order.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderSummaryTable;
