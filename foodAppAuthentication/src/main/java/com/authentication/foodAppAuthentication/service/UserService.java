package com.authentication.foodAppAuthentication.service;

import com.authentication.foodAppAuthentication.exception.EmailAlreadyExistingException;
import com.authentication.foodAppAuthentication.exception.EmailIdNotFoundException;
import com.authentication.foodAppAuthentication.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UserService {

    User getUserByEmail(String emailId);
    public User addUser(User user, MultipartFile profileImage) throws EmailAlreadyExistingException, IOException;

    public User loginUser(String emailId, String password) ;

    public User profileImage(String emailId, MultipartFile file) throws IOException;

    public void updatePassword(String emailId, String newPassword);
//
//    public abstract User getUserByEmailId(String emailId) throws EmailIdNotFoundException;
}
