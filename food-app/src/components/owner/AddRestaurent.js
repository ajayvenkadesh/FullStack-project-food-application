import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import visibility icons

// Validation Schema
const schema = yup.object().shape({
  restaurantName: yup.string().required("Restaurent name is required"),
  ownerName: yup.string().required("Owner name is required"),
  restaurantEmailId: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  address: yup.string().required("Address is required"),
  zipCode: yup
  .string()
  .required("Zip code is required")
  .test(
    "valid-zip-length",
    "Zip code must be exactly 6 digits",
    (value) => value && value.length === 6
  )
  .matches(/^\d+$/, "Zip code must be numeric"),
  phoneNo: yup
    .string()
    .required("Phone number is required")
    .test(
      "valid-length",
      "Phone number must be exactly 10 digits",
      (value) => value && value.length === 10
    )
    .test(
      "valid-start",
      "Phone number must start with 6, 7, 8, or 9",
      (value) => value && /^[6-9]/.test(value)
    ),
  password: yup
    .string()
    .required("Password must contain one symbol, one number, one uppercase, and one lowercase")
    .min(8, "Password must be at least 8 characters")
    .matches(/[!@#$%^&*(),.{}|<>]/, "Password must contain at least one symbol")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function AddRestaurent() {
    
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onBlur", // Ensures validation is triggered on every change
  });

  const navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error,setError]=useState('');
  

  const handleInputChange = async (field) => {
    await trigger(field); // Trigger validation on each change
  };


  const url= "http://localhost:8080/restaurant-Api/signup-owner"

  const onSubmit = async(data,event) => {    

    
    axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response)=>{
      console.log(data); // Handle form submission
      setSnackbarMessage("Signup successful!");
      
      setSnackbarSeverity("success");
      setSnackbarOpen(true); // Open snackbar on successful submission
      console.log('success',response.data);
     
      navigate('/Owner-login');  
    }).catch(er=>{
      alert(er);
      setError("error occured");
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close snackbar
  };

  
  return (
    <Container maxWidth="sm"   sx={{ bgcolor: '#ffffff',  marginTop:'53px', marginBottom:'53px',borderRadius:'20px',boxShadow: 3}}>
      {/* Form Title */}
      <Box sx={{padding:'20px',bgcolor:'#ffffff',borderRadius:'20px 20px 0 0px'}}>
              <Typography  variant="h6" component="p"> Welcome <b>Owners</b> to Foodiz, Please Sign up..</Typography>
               <hr style={{height:'3px', 
                    width:'200px', 
                    background:'linear-gradient(100deg, rgba(249,160,26,1) 0%, rgba(255,243,189,1) 100%',
                    border:'none',
                    borderRadius:'15px',
                    marginLeft:'0px'}}/>  
        </Box>           

      {/* Form Container */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 3,
          mt:-3,
          borderRadius: 2,
        }}
      >
         <TextField
          label="Restaurent Name"
          fullWidth
          {...register("restaurantName")}
          error={!!errors.restaurantName}
          helperText={errors.restaurantName?.message || ""}
          onBlur={(e) => handleInputChange("restaurantName")}
        />
        <TextField
          label="Owner Name"
          fullWidth
          {...register("ownerName")}
          error={!!errors.ownerName}
          helperText={errors.ownerName?.message || ""}
          onBlur={(e) => handleInputChange("ownerName")}
        />

        <TextField
          label="Owner Email Id"
          fullWidth
          {...register("restaurantEmailId")}
          error={!!errors.restaurantEmailId}
          helperText={errors.restaurantEmailId?.message || ""}
          onBlur={(e) => handleInputChange("restaurantEmailId")}
        />

        <TextField
          label="Address"
          fullWidth
          {...register("address")}
          error={!!errors.address}
          helperText={errors.address?.message || ""}
          onBlur={(e) => handleInputChange("address")}
        />

<TextField
          label="Zip Code"
          fullWidth
          {...register("zipCode")}
          error={!!errors.zipCode}
          helperText={errors.zipCode?.message || ""}
          onBlur={(e) => handleInputChange("zipCode")}
        />

        <TextField
          label="Phone Number"
          fullWidth
          {...register("phoneNo")}
          error={!!errors.phoneNo}
          helperText={errors.phoneNo?.message || ""}
          onBlur={(e) => handleInputChange("phoneNo")}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message || ""}
          onBlur={(e) => handleInputChange("password")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message || ""}
          onBlur={(e) => handleInputChange("confirmPassword")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  edge="end"
                >
                </IconButton>
              </InputAdornment>
            ),
          }}
        />


        {/* Submit Button */}
        <Button type="submit" variant="contained" size="large" sx={{borderRadius:5,backgroundColor:'#F9A01A'}}>
          Sign Up
        </Button>
        <p>If you are an owner already,please <a href="/Owner-login">Login</a></p>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

