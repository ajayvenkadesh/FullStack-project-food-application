import React, { useState, useEffect } from "react"; 
import { TextField, Button, Snackbar, Alert, Container, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function OtpView() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [resendDisabled, setResendDisabled] = useState(false); // Resend button state
  const [resendTimer, setResendTimer] = useState(30); // Timer for resend button
  const [countdown, setCountdown] = useState(60); // 1-minute timer
  const navigate = useNavigate();
  const location = useLocation(); // Retrieve email from location state
  const { emailId } = location.state || {}; // Get email passed from Signup component

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [countdown]);

  const handleOtpSubmit = () => {
    if (!emailId || !otp) {
      setError("OTP are required");
      return;
    }

    // Sending as query parameters instead of JSON
    axios
      .post(`http://localhost:8080/user-api/verify-otp?emailId=${encodeURIComponent(emailId)}&otp=${encodeURIComponent(otp)}`)
      .then((response) => {
        setSnackbarMessage("OTP verified successfully, your account is now activated.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate("/login"); // Redirect to login on success
      })
      .catch((error) => {
        setSnackbarMessage("Failed to verify OTP.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };
  
  const handleResendOtp = () => {
    setResendDisabled(true); // Disable the button to prevent spam
    setSnackbarMessage("Resending OTP...");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);

    // Sending emailId as a query parameter
    axios
      .post(`http://localhost:8080/user-api/resend-otp?emailId=${encodeURIComponent(emailId)}`)
      .then((response) => {
        setSnackbarMessage("OTP has been resent successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Reset countdown
        setCountdown(60);
        setResendTimer(30); // Reset resend timer
        setResendDisabled(false); // Re-enable resend button
      })
      .catch((error) => {
        setSnackbarMessage("Failed to resend OTP. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setResendDisabled(false); // Re-enable the button if resend fails
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
          padding: "20px",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          Verify OTP
        </Typography>
        <TextField
          label="OTP"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        {/* Timer Display */}
        <Typography variant="body1" sx={{ mb: 2 }}>
          Time remaining: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button variant="contained" color="warning" onClick={handleOtpSubmit} sx={{ mb: 2 }}>
          Verify OTP
        </Button>

        {/* Resend OTP Button */}
        <Button
          variant="outlined"
          color="warning"
          onClick={handleResendOtp}
          disabled={resendDisabled || countdown > 0}
          sx={{ mb: 2 }}
        >
          {resendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
        </Button>
      </Box>

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
}
