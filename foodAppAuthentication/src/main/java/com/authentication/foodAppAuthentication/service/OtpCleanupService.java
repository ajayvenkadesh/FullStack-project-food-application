package com.authentication.foodAppAuthentication.service;

import com.authentication.foodAppAuthentication.model.User;
import com.authentication.foodAppAuthentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OtpCleanupService {
    @Autowired
    private UserRepository userRepository;

    // Run this task every minute to clear expired OTPs
    @Scheduled(fixedRate = 60000)
    public void clearExpiredOtps() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> {
            if (user.getOtp() != null && user.getOtpCreationTime().isBefore(LocalDateTime.now().minusMinutes(2))) {
                user.setOtp(null);
                user.setOtpCreationTime(null);
                userRepository.save(user);
            }
        });
    }
}
