package com.authentication.foodAppAuthentication.service;

import com.authentication.foodAppAuthentication.exception.EmailIdNotFoundException;
import com.authentication.foodAppAuthentication.model.Admin;

public interface AdminService {
    public abstract Admin adminLogin(String adminId, String securityCode) throws EmailIdNotFoundException;
}
