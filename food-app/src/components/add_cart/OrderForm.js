import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext"; // Import CartContext

const OrderForm = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { cartItems, totalAmount } = location.state;
  const { clearCart } = useCart(); // Get clearCart function from CartContext

  // Prefill user data from token or API
  useEffect(() => {
    const userToken = localStorage.getItem("jwtToken");
    if (userToken) {
      try {
        const decodedToken = JSON.parse(atob(userToken.split(".")[1]));
        setCurrentUserEmail(decodedToken.currentUserEmailId);
        setValue("emailId", decodedToken.currentUserEmailId);
        setValue("address", decodedToken.currentUserAddress);
        setValue("phone", decodedToken.currentUserMobileNo);
        setValue("zip", decodedToken.currentUserZipCode);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [setValue]);

  const handlePayment = (data) => {
    const options = {
      key: "rzp_test_3XcOKgGRSriIB1", // Replace with your Razorpay API key
      amount: totalAmount * 100,
      currency: "INR",
      name: "Your Food Delivery App",
      description: "Thank you for your purchase!",
      image: "https://your-logo-url.com/logo.png",
      handler: async function (response) {
        try {
          // Prepare order details after successful payment
          const orderDetails = {
            ...data,
            items: cartItems,
            totalAmount,
            paymentId: response.razorpay_payment_id,
            restaurantEmailId: data.restaurantEmailId ,
            status: "pending", // Order status before approval
          };

          // Convert the order details to FormData
          const formData = new FormData();
          formData.append("phone", data.phone);
          formData.append("address", data.address);
          formData.append("city", data.city);
          formData.append("state", data.state);
          formData.append("zip", data.zip);
          formData.append("landMark", data.landMark);
          formData.append("emailId", data.emailId);
          formData.append("items", JSON.stringify(cartItems));
          formData.append("totalAmount", totalAmount);
          formData.append("paymentId", response.razorpay_payment_id);
          formData.append("status", "pending");

          // Send the form data to the backend
          await axios.post("http://localhost:8081/api/orders/place-order", formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          });

          // Clear the cart after successful payment
          await clearCart(currentUserEmail); // Clear the cart for the current user

          // Navigate to OrderSummary after successful payment and order creation
          navigate("/orderSummaryTable", { state: { orderDetails, restaurantEmail: orderDetails.restaurantEmailId } });

        } catch (error) {
          console.error("Error saving order:", error);
        }
      },
      prefill: {
        name: data.name,
        email: data.emailId,
        contact: data.phone,
      },
      theme: {
        color: "#F9A01A",
      },
    };

    // Open Razorpay payment modal
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const onSubmit = (data) => {
    handlePayment(data);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Order Form</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            {...register("name", { required: true })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("emailId", { required: true })}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            {...register("phone", { required: true })}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            {...register("address", { required: true })}
          />
          <TextField
            label="City"
            fullWidth
            margin="normal"
            {...register("city", { required: true })}
          />
          <TextField
            label="State"
            fullWidth
            margin="normal"
            {...register("state", { required: true })}
          />
          <TextField
            label="Zip Code"
            fullWidth
            margin="normal"
            {...register("zip", { required: true })}
          />
          <TextField
            label="Landmark"
            fullWidth
            margin="normal"
            {...register("landMark", { required: true })}
          />

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Pay ₹{totalAmount.toFixed(2)}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default OrderForm;
