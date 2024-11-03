package com.authentication.foodAppAuthentication.service;

import com.authentication.foodAppAuthentication.exception.EmailAlreadyExistingException;
import com.authentication.foodAppAuthentication.model.User;
import com.authentication.foodAppAuthentication.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Generate OTP
    public String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));  // Generates 6 digit OTP
    }

    // Send OTP via email
    public void sendOtpEmail(String emailId, String otp) {
        String subject = "Your OTP for Verification";
        String message = "Your OTP is: " + otp + ". It will expire in 1 minute.";
        emailService.sendEmail(emailId, subject, message);
    }

    // Save OTP and timestamp in user entity
    public User saveOtpForUser(String emailId) throws EmailAlreadyExistingException {
        Optional<User> optionalUser = userRepository.findById(emailId);

        if (optionalUser.isEmpty()) {
            throw new EmailAlreadyExistingException();
        }

        User user = optionalUser.get();
        String otp = generateOtp();  // Generate new OTP
        user.setOtp(otp);
        user.setOtpCreationTime(LocalDateTime.now());  // Set current time for expiration check
        user.setStatus("PENDING");  // Ensure user status is set to PENDING
        userRepository.save(user);

        sendOtpEmail(emailId, otp);  // Send the OTP email

        System.out.println("Generated OTP: " + otp);
        System.out.println("OTP Creation Time: " + user.getOtpCreationTime());

        return user;
    }

    // Verify OTP within 1 minute
    public boolean verifyOtp(String emailId, String otp) {
        Optional<User> optionalUser = userRepository.findById(emailId);

        System.out.println(emailId);

        if (optionalUser.isEmpty()) {
            System.out.println("User not found.");
            return false;
        }

        User user = optionalUser.get();
        if (user.getOtp() == null || user.getOtpCreationTime() == null) {
            System.out.println("OTP or creation time is null.");
            return false;
        }

        System.out.println("Entered OTP: " + otp);
        System.out.println("Stored OTP: " + user.getOtp());
        System.out.println("Current Time: " + LocalDateTime.now());
        System.out.println("OTP Creation Time: " + user.getOtpCreationTime());

        // Check if OTP is correct and has not expired
        if (user.getOtp().equals(otp) && user.getOtpCreationTime().isAfter(LocalDateTime.now().minusMinutes(1))) {
            // Mark user as active and clear OTP
            user.setStatus("Active");
            user.setOtp(null);
            user.setOtpCreationTime(null);
            userRepository.save(user);
            return true;
        } else if (user.getOtpCreationTime().isBefore(LocalDateTime.now().minusMinutes(1))) {
            // OTP has expired, allow user to re-initiate signup
            user.setOtp(null);
            user.setOtpCreationTime(null);
            user.setStatus("PENDING"); // Or any other status you want to set
            userRepository.save(user);
            return false; // Optionally, return false or throw an exception
        }
        System.out.println("Invalid or expired OTP.");
        return false;
    }

    // Clear OTP after 1 minute
    public void clearOtpAfterTimeout(User user) {
        if (user.getOtp() != null && user.getOtpCreationTime() != null &&
                user.getOtpCreationTime().isBefore(LocalDateTime.now().minusMinutes(2))) {
            user.setOtp(null);
            user.setOtpCreationTime(null);
            userRepository.save(user);
        }
    }
}
