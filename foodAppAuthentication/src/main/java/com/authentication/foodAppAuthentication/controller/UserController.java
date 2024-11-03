package com.authentication.foodAppAuthentication.controller;

import com.authentication.foodAppAuthentication.CustomMessage.Message;
import com.authentication.foodAppAuthentication.exception.EmailAlreadyExistingException;
import com.authentication.foodAppAuthentication.model.User;
import com.authentication.foodAppAuthentication.service.OtpService;
import com.authentication.foodAppAuthentication.service.UserService;
import com.authentication.foodAppAuthentication.tokenGeneration.GenerateJwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/user-api")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private GenerateJwt generateJwt;

    @Autowired
    private OtpService otpService;



    @PostMapping("/signup-user")
    public ResponseEntity<?> addUser(@RequestParam("emailId") String emailId,
                                     @RequestParam("userName") String userName,
                                     @RequestParam("address") String address,
                                     @RequestParam("phoneNo") long phoneNo,
                                     @RequestParam("zipCode") int zipCode,
                                     @RequestParam("password") String password,
                                     @RequestParam(value ="role" ,required = false) String role,
                                     @RequestParam(value ="status" ,required = false) String status,
                                     @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            // Create a User object from the request parameters
            User user = new User();
            user.setEmailId(emailId);
            user.setUserName(userName);
            user.setPassword(password);
            user.setAddress(address);
            user.setPhoneNo(phoneNo);
            user.setZipCode(zipCode);
            user.setRole(user.getRole());
            user.setStatus(user.getStatus());

            User createdUser = userService.addUser(user, profileImage);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (EmailAlreadyExistingException e) {
            return new ResponseEntity<>(new Message("Error", "Email already exists"), HttpStatus.CONFLICT);
        } catch (IOException e) {
            return new ResponseEntity<>(new Message("Error", "Failed to upload image"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint for verifying OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String emailId, @RequestParam String otp) {

        System.out.println("Verifying OTP for email: " + emailId); // Debug log
        if (otpService.verifyOtp(emailId, otp)) {
            return new ResponseEntity<>("OTP verified successfully, user activated.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid or expired OTP.", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String emailId) {
        try {
            // Fetch the user by email
            User user = userService.getUserByEmail(emailId); // Ensure this method is implemented correctly

            // Check if the user status is PENDING
            if ("PENDING".equals(user.getStatus())) {
                otpService.saveOtpForUser(emailId); // Resend OTP
                return new ResponseEntity<>("OTP resent successfully.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not in a valid state for OTP resend.", HttpStatus.BAD_REQUEST);
            }
        } catch (EmailAlreadyExistingException e) {
            return new ResponseEntity<>(new Message("Error", "Email does not exist."), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/login-user")
    public ResponseEntity<?> loginCheck(@RequestBody User loginRequest) {
        try {
            // Fetch the user from the database using the emailId
            User userFromDb = userService.loginUser(loginRequest.getEmailId(), loginRequest.getPassword());

            // Check if the user status is "Active"
            if (userFromDb.getStatus() != null && userFromDb.getStatus().equalsIgnoreCase("Active")) {
                // Remove the password from the result for security reasons
                userFromDb.setPassword(null);

                // Generate JWT token and return it in the response
                return new ResponseEntity<>(generateJwt.generateTokenUser(userFromDb), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new Message("Error", "User account is not active"), HttpStatus.UNAUTHORIZED);
            }

        } catch (RuntimeException e) {
            return new ResponseEntity<>(new Message("Error", "Invalid email or password"), HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping("/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("emailId") String emailId,
                                                @RequestParam("file") MultipartFile file) throws IOException {
        try {
            User updatedUser = userService.profileImage(emailId, file);
            // Assuming the filename is stored correctly
            String imageUrl = "http://localhost:8080/profile-image/" + updatedUser.getProfileImageFileName();
            return ResponseEntity.ok(imageUrl); // Return the image URL
        } catch (IOException e) {
            return new ResponseEntity<>(new Message("Error", "Failed to upload image"), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("emailId") String emailId) {
        try {
            // Generate and send OTP
            otpService.saveOtpForUser(emailId);
            return new ResponseEntity<>(new Message("Success", "OTP sent to your email."), HttpStatus.OK);
        } catch (RuntimeException | EmailAlreadyExistingException e) {
            return new ResponseEntity<>(new Message("Error", "Email not found."), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<?> verifyResetOtp(@RequestParam("emailId") String emailId, @RequestParam("otp") String otp) {
        if (otpService.verifyOtp(emailId, otp)) {
            return new ResponseEntity<>(new Message("Success", "OTP verified. You can now reset your password."), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new Message("Error", "Invalid or expired OTP."), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("emailId") String emailId,
                                           @RequestParam("newPassword") String newPassword) {
        try {
            userService.updatePassword(emailId, newPassword);
            return new ResponseEntity<>(new Message("Success", "Password reset successful."), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(new Message("Error", "Password reset failed."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
