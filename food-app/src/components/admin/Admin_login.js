//chatgt

import React, { useState,useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Container, Box, TextField, Typography, Button, Alert } from '@mui/material';
import {categoryContext} from "../../App"

export default function Admin_login() {
  const [serverError, setServerError] = useState('');  // To capture server errors
  const [loading, setLoading] = useState(false);  // To show loading state if necessary
  const navigate = useNavigate(); 
  const {handleAdminLogin} = useContext(categoryContext);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  let url = "http://localhost:8080/admin-Api/login-admin";
    const onSubmit = async (data,event) => {
          event.preventDefault(); 
          try {
            const response = await axios.post(url,{
                adminId: data.adminId,                          //key value pair for easy authentication
                securityKey: data.securityKey
            }); 
            const { token } = response.data;
            localStorage.setItem('adminJwtToken', token);
            
            // onlogin();
            handleAdminLogin();
            alert('Welcome Admin Login success');
            alert(JSON.stringify(data));
            alert(localStorage.getItem('adminJwtToken'));
            console.log(localStorage.getItem('adminJwtToken'));
            console.log(response.data)
            navigate('/admin-view');
          } catch (error) {
            console.error('Error during login:', error);
            alert(JSON.stringify(data));
            setServerError('Incorrect username or password');
          }
        };

  return (
    <Container fixed maxWidth="sm">
      <Box className="BoxStyle" sx={{ bgcolor: '#ffffff', height: 'auto', marginTop: '170px', marginBottom: '185px', borderRadius: '20px' }}>
        <Box sx={{ padding: '20px', bgcolor: '#ffffff', borderRadius: '20px 20px 0 0px' }}>
          <Typography variant="h6" component="p">Welcome <b>Admin</b> of Foodiz, Please Login..</Typography>
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
            label="adminId"
            {...register("adminId", { required: "adminId is required" })}
            error={!!errors.adminId}
            helperText={errors.adminId ? errors.adminId.message : ""}
          />

          <TextField
            variant="outlined"
            required
            fullWidth
            type="password"
            label="securityKey"
            {...register("securityKey", { required: "securityKey is required" })}
            error={!!errors.securityKey}
            helperText={errors.securityKey ? errors.securityKey.message : ""}
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
        </Box>
      </Box>
    </Container>
  );
}