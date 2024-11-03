package com.authentication.foodAppAuthentication.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class User {
    @Id
    private String emailId;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private long phoneNo;

    @Column(nullable = false)
    private int zipCode;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String status;

    @Column
    private String profileImageFileName; // Stores the profile image file name

    @Column
    private String otp;

    @Column
    private LocalDateTime otpCreationTime;
}
