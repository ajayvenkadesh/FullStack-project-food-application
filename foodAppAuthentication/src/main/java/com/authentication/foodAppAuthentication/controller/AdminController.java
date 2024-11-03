package com.authentication.foodAppAuthentication.controller;


import com.authentication.foodAppAuthentication.CustomMessage.Message;
import com.authentication.foodAppAuthentication.exception.EmailIdNotFoundException;
import com.authentication.foodAppAuthentication.model.Admin;
import com.authentication.foodAppAuthentication.service.AdminService;
import com.authentication.foodAppAuthentication.tokenGeneration.GenerateJwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin-Api")
public class AdminController {

    @Autowired
    AdminService adminService;

    @Autowired
    GenerateJwt generateJwt;

    @PostMapping("/login-admin")
    public ResponseEntity<?> adminLogin(@RequestBody Admin admin) throws EmailIdNotFoundException {
        try {
            Admin result = adminService.adminLogin(admin.getAdminId(), admin.getSecurityKey());
            result.setSecurityKey(null);
            return new ResponseEntity<>(generateJwt.generateTokenAdmin(result), HttpStatus.OK);
        }
        catch (EmailIdNotFoundException e) {
            Message msg = new Message("Error", "Admin Login failed: ");
            return new ResponseEntity<>(msg, HttpStatus.NOT_FOUND);
        }
    }
}
