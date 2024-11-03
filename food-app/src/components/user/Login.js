
import React, { useState,useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Container, Box, TextField, Typography, Button, Alert } from '@mui/material';
import {categoryContext} from "../../App"
import { jwtDecode } from 'jwt-decode';
import { useUser } from './UserContext';


export default function Login() {
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser(); // Get setUser from useUser hook
    const location = useLocation();
    const { handleLogin } = useContext(categoryContext); // Get the context
  
    const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm();
  
    let url = "http://localhost:8080/user-api/login-user";
  
    const onSubmit = async (data, event) => {
      event.preventDefault();
      try {
        const response = await axios.post(url, {
          emailId: data.emailId,
          password: data.password
        });
        const { token } = response.data;
        localStorage.setItem('jwtToken', token);
      
        // Decode the token to extract user details
        const decodedToken = jwtDecode(token);
        const emailId = decodedToken.currentUserEmailId; // Adjust according to your token structure
        const userName = decodedToken.currentUserName; // Extract user name
        const imageFileName=decodedToken.currentUserImage;

        localStorage.setItem('emailId', emailId);
        // Store email and user name in context
        handleLogin();
        setUser({ emailId, userName,imageFileName }); // Store the email ID in the context
        alert('Login success');
        console.log('Logged in user email:', emailId);
        navigate('/home');
      } catch (error) {
        console.error('Error during login:', error);
        setServerError('Incorrect username or password');
      }
    };
  
    return (
      <Container fixed maxWidth="sm">
        <Box className="BoxStyle" sx={{ bgcolor: '#ffffff', height: 'auto', marginTop: '132px', marginBottom: '132px', borderRadius: '20px' }}>
          <Box sx={{ padding: '20px', bgcolor: '#ffffff', borderRadius: '20px 20px 0 0px' }}>
            <Typography variant="h6" component="p">Welcome <b>Users</b> to Foodiz, Please Login..</Typography>
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
            onSubmit={handleSubmit(onSubmit)} // Link form submission to the onSubmit handler
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
              label="Email"
              {...register("emailId", { required: "Email is required" })}
              error={!!errors.emailId}
              helperText={errors.emailId ? errors.emailId.message : ""}
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

             {/* Forgot Password link */}
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
                <Typography variant="body2" sx={{ cursor: 'pointer', color: '#F9A01A' }} onClick={() => navigate('/forgot-password')}>
                    Forgot Password?
                </Typography>
              </Box>
  
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ borderRadius: 5, backgroundColor: '#F9A01A' }}
              disabled={loading} // Disable button when loading
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
  
            <p>If you are a new user, please <a href="/signup">Sign up</a><br />
              If you are an Admin, please <a href="/Admin">Click here</a></p>
          </Box>
        </Box>
      </Container>
    );
  }