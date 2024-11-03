package com.authentication.foodAppAuthentication.service;

import com.authentication.foodAppAuthentication.exception.EmailIdNotFoundException;
import com.authentication.foodAppAuthentication.model.Admin;
import com.authentication.foodAppAuthentication.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Override
    public Admin adminLogin(String adminId, String securityCode) throws EmailIdNotFoundException {
        String fixedAdminId = "admin1@gmail.com";
        String fixedSecurityCode = "admin123";
        String role="admin";

        if (fixedAdminId.equals(adminId) && fixedSecurityCode.equals(securityCode)) {
            Admin admin = new Admin();
            admin.setAdminId(fixedAdminId);
            admin.setSecurityKey(fixedSecurityCode);
            admin.setRole(role);
            return admin;
        } else {
            throw new EmailIdNotFoundException();
        }
    }
}
