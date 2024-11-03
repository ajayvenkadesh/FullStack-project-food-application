package com.authentication.foodAppAuthentication.tokenGeneration;

import com.authentication.foodAppAuthentication.model.Admin;
import com.authentication.foodAppAuthentication.model.Owner;
import com.authentication.foodAppAuthentication.model.User;

import java.util.Map;

public interface GenerateJwt {
    public abstract Map<String,String> generateTokenUser(User user);
    public abstract Map<String,String> generateTokenAdmin(Admin admin);
    public abstract Map<String,String> generateTokenOwner(Owner owner);

}
