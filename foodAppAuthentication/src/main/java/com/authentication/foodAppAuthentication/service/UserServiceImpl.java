package com.authentication.foodAppAuthentication.service;

import com.authentication.foodAppAuthentication.exception.EmailAlreadyExistingException;
import com.authentication.foodAppAuthentication.model.User;
import com.authentication.foodAppAuthentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;


    @Autowired OtpService otpService;

    @Scheduled(fixedRate = 300000)  // Runs every minute
    public void removePendingUsersAfterTimeout() {
        List<User> pendingUsers = userRepository.findByStatus("PENDING");

        LocalDateTime now = LocalDateTime.now();
        for (User user : pendingUsers) {
            if (user.getOtpCreationTime() != null && user.getOtpCreationTime().plusMinutes(5).isBefore(now)) {
                // User's OTP has expired, delete the user
                userRepository.delete(user);
                System.out.println("Deleted user with email: " + user.getEmailId() + " due to expired OTP");
            }
        }
    }

    @Override
    public User getUserByEmail(String emailId) {
        return userRepository.findById(emailId)
                .orElseThrow(() -> new RuntimeException("User not found")); // Handle this exception properly
    }


    @Override
    public User addUser(User user, MultipartFile profileImage) throws EmailAlreadyExistingException, IOException {
        if (userRepository.findById(user.getEmailId()).isEmpty()) {
            user.setRole("ROLE_USER");
            user.setStatus("PENDING");

            // Handle profile image upload
            if (profileImage != null && !profileImage.isEmpty()) {
                String fileName = fileService.saveProfileImage(profileImage);
                user.setProfileImageFileName(fileName);
            } else {
                // Set default image if no profile image is uploaded
                user.setProfileImageFileName("default.jpg");
            }

            // Save user with status PENDING before generating OTP
            User createdUser = userRepository.save(user);

            // Now generate and send OTP for the user
            otpService.saveOtpForUser(user.getEmailId());

            return createdUser;
        } else {
            throw new EmailAlreadyExistingException();
        }
    }

    @Override
    public User loginUser(String emailId, String password) {
        List<User> users = userRepository.findAll();
        return users.stream().filter(user -> user.getEmailId().equals(emailId) && user.getPassword().equals(password))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }

    @Override
    public void updatePassword(String emailId, String newPassword) {
        User user = userRepository.findById(emailId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(newPassword);  // Ensure password is hashed in a real implementation
        userRepository.save(user);
    }

    // Method to update profile image after signup
    public User profileImage(String emailId, MultipartFile file) throws IOException {
        User user = userRepository.findById(emailId)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        String fileName = fileService.saveProfileImage(file);
        user.setProfileImageFileName(fileName);
        return userRepository.save(user);
    }

    
}
