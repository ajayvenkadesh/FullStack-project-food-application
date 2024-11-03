package com.authentication.foodAppAuthentication.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Admin {
    private String adminId;
    private String securityKey;
    private String role;
}
