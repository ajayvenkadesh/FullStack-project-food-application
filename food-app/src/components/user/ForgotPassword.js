import React, { useState, useEffect } from "react"; 
import { TextField, Button, Box, Container, Typography, Alert, Snackbar } from "@mui/material"; // Import Snackbar from MUI
import MuiAlert from '@mui/material/Alert'; // Import Alert for Snackbar
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const passwordSchema = yup.object().shape({
    newPassword: yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[!@#$%^&*(),.{}|<>]/, "Password must contain at least one symbol")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
});

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [countdown, setCountdown] = useState(60); // 2-minute timer
    const [resendDisabled, setResendDisabled] = useState(false); // State for resend button
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [resendTimer, setResendTimer] = useState(30); // Timer for resend button
    const [error, setError] = useState("");//validation error
    const navigate = useNavigate();

    useEffect(() => {
        if (serverError || successMessage) {
          const timer = setTimeout(() => {
            setServerError(null);  // Clear error message after 3 seconds
            setSuccessMessage(null);  // Clear success message after 3 seconds
          }, 3000); // 3000 ms = 3 seconds
    
          // Clean up the timer if the component unmounts or messages change
          return () => clearTimeout(timer);
        }
      }, [serverError, successMessage]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer); // Cleanup on unmount
        }
    }, [countdown]);

    // Check if the user is authenticated (token exists in localStorage)
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert("You must be signed in to access Forgot Password");
            navigate("/login"); // Redirect to login if not signed in
        }
    }, [navigate]);

    // Sending OTP to user's email
    const handleSendOtp = async () => {
        try {
            const encodedEmail = encodeURIComponent(email); // Encode the email
            const response = await axios.post(`http://localhost:8080/user-api/forgot-password?emailId=${encodedEmail}`);
            setSuccessMessage("OTP sent to your email.");
            setStep(2);
        } catch (error) {
            console.error(error);
            setServerError("Error sending OTP. Email might not be registered.");
        }
    };

    // Verifying OTP
    const handleVerifyOtp = async () => {
        try {
            const encodedEmail = encodeURIComponent(email); // Encode the email
            const response = await axios.post(`http://localhost:8080/user-api/verify-reset-otp?emailId=${encodedEmail}&otp=${otp}`);
            setSuccessMessage("OTP verified. You can now reset your password.");
            setStep(3); // Move to the password reset step
        } catch (error) {
            console.error(error);
            setServerError("Invalid OTP.");
        }
    };

    // Resetting password after verifying OTP
   

    const handleResetPassword = async () => {

        if (!newPassword) {
            setError("Password must be entered"); // Show error if the password is empty
            return;
        }

        try {

            await passwordSchema.validate({ newPassword });//valdting

            const encodedEmail = encodeURIComponent(email); // Encode the email
            await axios.post(`http://localhost:8080/user-api/reset-password?emailId=${encodedEmail}&newPassword=${newPassword}`);
            setSuccessMessage("Password reset successfully.");
            setStep(4); // Show success step
        // } catch (error) {
        //     console.error(error);
        //     setServerError("Password reset failed.");
        // }
        }catch (validationError) {
            // If Yup validation fails, display the error message
            if (validationError.name === 'ValidationError') {
                setError(validationError.message); // Set Yup validation error
            } else {
                // For other server errors
                console.error(validationError);
                setServerError("Password reset failed.");
            }
        }
    };

    // Resending OTP
    const handleResendOtp = () => {
        const encodedEmail = encodeURIComponent(email); // Define encodedEmail here
        setResendDisabled(true);
        setSnackbarMessage("Resending OTP...");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);

        // Sending emailId as a query parameter
        axios
          .post(`http://localhost:8080/user-api/resend-otp?emailId=${encodedEmail}`)
          .then((response) => {
            setSnackbarMessage("OTP has been resent successfully.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            // Reset countdown
            setCountdown(120);
            setResendTimer(30);
            setResendDisabled(false); // Re-enable resend button
          })
          .catch((error) => {
            setSnackbarMessage("Failed to resend OTP. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setResendDisabled(false); // Re-enable the button if resend fails
          });
    };

    //back
    const backto = () =>{
        navigate('/login')
    }

    return (
        <Container maxWidth="sm" sx={{padding:19.2}} >
            <Box sx={{  padding: 4, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5">Forgot Password</Typography>
                <hr style={{
              height: '3px',
              width: '200px',
              background: 'linear-gradient(100deg, rgba(249,160,26,1) 0%, rgba(255,243,189,1) 100%',
              border: 'none',
              borderRadius: '15px',
              marginLeft: '0px'
            }} />
                {serverError && <Alert severity="error">{serverError}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}

                {/* Step 1: Request OTP */}
                {step === 1 && (
                    <>
                        <TextField
                            label="Enter your email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button variant="contained" color="warning" fullWidth onClick={handleSendOtp}>
                            Send OTP
                        </Button>
                        <Button sx={{marginTop:2,borderColor:'#F9A01A',color:"#F9A01A" }}  variant="outlined" fullWidth onClick={backto}>
                           Back to Login
                        </Button>
                    </>
                )}

                {/* Step 2: Verify OTP */}
                {step === 2 && (
                    <>
                        <TextField
                            label="Enter OTP"
                            fullWidth
                            margin="normal"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Time remaining: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                        </Typography>
                        <Button variant="contained" color="warning" fullWidth onClick={handleVerifyOtp} sx={{ mb: 2 }}>
                            Verify OTP
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            fullWidth
                            onClick={handleResendOtp}
                            disabled={resendDisabled} sx={{ mb: 2 }}
                        >
                           {resendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                        </Button>
                    </>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                    <>
                        <TextField
                            required //temporary given this but it will show tooltip of "fill out this field"
                            label="New Password"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={newPassword}
                            onChange={(e) => {setNewPassword(e.target.value)
                                setError(""); // Clear error on input change
                                 }}
                            error={!!error} // Set error state
                            helperText={error} // Display error message
                                        
                            
                        />
                        <Button variant="contained" fullWidth onClick={handleResetPassword}>
                            Reset Password
                        </Button>
                    </>
                )}

                {/* Step 4: Success Message */}
                {step === 4 && <Typography>Password reset successfully. Please <a href="/login">login</a>.</Typography>}
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}
