import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { TextField, Button, Container, Box, Typography, InputAdornment, IconButton, Snackbar, Alert, Avatar } from "@mui/material";
import { Visibility, VisibilityOff, PhotoCamera, UploadFile } from "@mui/icons-material";  // Import visibility and upload icons
import { useNavigate } from "react-router-dom";

// Validation Schema
const schema = yup.object().shape({
  userName: yup.string().required("user name is required")
  .matches(/[a-z]/, "user name shouldn't be numeric"),
  emailId: yup.string().email("Invalid email format").required("Email is required")
  .test(
    "starts-with-lowercase",
    "Email should start with a lowercase letter",
    (value) => /^[a-z]/.test(value)
  )
  .test(
      "contains-at-symbol",
      'Email must contain the "@" symbol',
      (value) => /@/.test(value)
  )
  .test( 
    "valid-domain",
    "Domain must be valid (e.g., example.com)",
    (value) => {
        const parts = value.split("@");
        return parts.length === 2 && /^[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(parts[1]);
    }),
  address: yup.string().required("Address is required"),
  zipCode: yup
    .string()
    .required("Zip code is required")
    .test("valid-zip-length", "Zip code must be exactly 6 digits", (value) => value && value.length === 6)
    .test("valid-start", "Zip code must start with 6", (value) => value && /^[6]/.test(value))
    .matches(/^\d+$/, "Zip code must be numeric"),
  phoneNo: yup
    .string()
    .required("Phone number is required")
    .test("valid-length", "Phone number must be exactly 10 digits", (value) => value && value.length === 10)
    .test("valid-start", "Phone number must start with 6, 7, 8, or 9", (value) => value && /^[6-9]/.test(value)),
  password: yup
    .string()
    .required("Password must contain one symbol, one number, one uppercase, and one lowercase")
    .min(8, "Password must be at least 8 characters")
    .matches(/[!@#$%^&*(),.{}|<>]/, "Password must contain at least one symbol")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm Password is required"),
});

export default function SignUp() {
  const { register, handleSubmit, trigger, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = async (field) => {
    await trigger(field);
  };

  const url = "http://localhost:8080/user-api"; // Backend API

  const onSubmit = async (data, event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("emailId", data.emailId);
    formData.append("userName", data.userName);
    formData.append("address", data.address);
    formData.append("phoneNo", data.phoneNo);
    formData.append("zipCode", data.zipCode);
    formData.append("password", data.password);
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    try {
      const response = await axios.post(`${url}/signup-user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMessage("Signup successful! Please verify OTP.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Store email and navigate to OTP page
      navigate("/OtpPage", { state: { emailId: data.emailId } });
    } catch (error) {
      setError("Signup failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSnackbarMessage("emailid already existing ")
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Only proceed if a file is selected
      setSelectedFile(file);
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);  // Only call this if the file is a valid Blob
    } else {
      console.error("No file selected or invalid file.");
    }
  };
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ bgcolor: '#ffffff', marginTop: '53px', marginBottom: '53px', borderRadius: '20px', boxShadow: 3 }}>
      <Box sx={{ padding: '20px', bgcolor: '#ffffff', borderRadius: '20px 20px 0 0px' }}>
        <Typography variant="h6" component="p"> Hello, <b>New User</b> Welcome to Foodiz, Please Sign up..</Typography>
        <hr style={{
          height: '3px',
          width: '200px',
          background: 'linear-gradient(100deg, rgba(249,160,26,1) 0%, rgba(255,243,189,1) 100% ',
          border: 'none',
          borderRadius: '15px',
          marginLeft: '0px'
        }} />
      </Box>
      

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3, mt: -3, borderRadius: 2,alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={profileImagePreview} alt="Profile Preview" sx={{ width: 80, height: 80, mr: 2 }} />
          <label htmlFor="profile-image-upload">
            <input
              accept="image/*"
              id="profile-image-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <IconButton color="warning" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        {selectedFile && (
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Selected File: {selectedFile.name}
          </Typography>
        )}

        {error && (
          <Typography color="error" variant="body1" sx={{ marginTop: 1 }}>
            {error}
          </Typography>
        )}
        <TextField label="Email" fullWidth {...register("emailId")} error={!!errors.emailId} helperText={errors.emailId?.message || ""} onBlur={(e) => handleInputChange("emailId")} />
        <TextField label="Full name" fullWidth {...register("userName")} error={!!errors.userName} helperText={errors.userName?.message || ""} onBlur={(e) => handleInputChange("userName")} />
        <TextField label="Address" fullWidth {...register("address")} error={!!errors.address} helperText={errors.address?.message || ""} onBlur={(e) => handleInputChange("address")} />
        <TextField label="Phone Number" fullWidth {...register("phoneNo")} error={!!errors.phoneNo} helperText={errors.phoneNo?.message || ""} onBlur={(e) => handleInputChange("phoneNo")} />
        <TextField label="Zip Code" fullWidth {...register("zipCode")} error={!!errors.zipCode} helperText={errors.zipCode?.message || ""} onBlur={(e) => handleInputChange("zipCode")} />
        
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
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
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
                <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Custom file upload box
        <Button
          variant="outlined"
          component="label"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2, borderStyle: 'dashed', color: '#F9A01A', borderColor: '#F9A01A' }}
        >
          <UploadFile sx={{ marginRight: 1 }} /> Upload Profile Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button> */}


        <Button type="submit" variant="contained" color="warning" size="large" sx={{ borderRadius: 5, backgroundColor: '#F9A01A' }}>
          Sign Up
        </Button>
        <p>If you are an existing user, please <a href="/login">Login</a></p>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
