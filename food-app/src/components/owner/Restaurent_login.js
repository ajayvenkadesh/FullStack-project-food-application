
import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Container, Box, TextField, Typography, Button, Alert } from '@mui/material';
import { categoryContext } from "../../App";

export default function Restaurent_login() {
  const [serverError, setServerError] = useState('');  // To capture server errors
  const [loading, setLoading] = useState(false);  // To show loading state if necessary
  const navigate = useNavigate();
  const {handleOwnerLogin} = useContext(categoryContext);


  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();


  let url = "http://localhost:8080/restaurant-Api/login-owner";
    const onSubmit = async (data,event) => {
          
          try {
            const response = await axios.post(url,{
              restaurantEmailId: data.restaurantEmailId,    //key value pair for easy authentication
              password: data.password
            }); 
            const { token } = response.data;
            localStorage.setItem('OwnerJwtToken', token);
            
            handleOwnerLogin();
            
            alert('Welcome Owner Login success');
            console.log(response.data);
            console.log(localStorage.getItem('OwnerJwtToken'));
            navigate('/owner-view');
          } catch (error) {
            console.error('Error during login:', error);
            alert(JSON.stringify(data));
            setServerError('Incorrect username or password');
          }
        };
  

  return (
    <Container fixed maxWidth="sm">
      <Box className="BoxStyle" sx={{ bgcolor: '#ffffff', height: 'auto', marginTop: '152px', marginBottom: '145px', borderRadius: '20px' }}>
        <Box sx={{ padding: '20px', bgcolor: '#ffffff', borderRadius: '20px 20px 0 0px' }}>
          <Typography variant="h6" component="p">Welcome <b>Owners</b> to  Foodiz, Please Login..</Typography>
          <hr style={{
            height: '3px',
            width: '200px',
            background: 'linear-gradient(100deg, rgba(249,160,26,1) 0%, rgba(255,243,189,1) 100%',
            border: 'none',
            borderRadius: '15px',
            marginLeft: '0px'
          }} />
        </Box>

        {/* Display server error if exists */}
        {serverError && <Alert severity="error">{serverError}</Alert>}

        {/* Login form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}  // Link form submission to the onSubmit handler
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 3,
            mt: -3,
            borderRadius: 2,
          }}
        >
          <TextField
            variant="outlined"
            required
            fullWidth
            label="restaurantEmailId"
            {...register("restaurantEmailId", { required: "Email is required" })}
            error={!!errors.restaurantEmailId}
            helperText={errors.restaurantEmailId ? errors.restaurantEmailId.message : ""}
          />

          <TextField
            variant="outlined"
            required
            fullWidth
            type="password"
            label="Password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ borderRadius: 5, backgroundColor: '#F9A01A' }}
            disabled={loading}  // Disable button when loading
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p>If you are a new owner, please <a href="/Owner-signup">Sign up</a></p>
        </Box>
      </Box>
    </Container>
  );
}
