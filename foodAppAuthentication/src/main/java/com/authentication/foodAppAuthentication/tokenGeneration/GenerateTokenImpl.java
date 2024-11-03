package com.authentication.foodAppAuthentication.tokenGeneration;

import com.authentication.foodAppAuthentication.model.Admin;
import com.authentication.foodAppAuthentication.model.Owner;
import com.authentication.foodAppAuthentication.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class GenerateTokenImpl implements GenerateJwt {
    @Override
    public Map<String, String> generateTokenUser(User user) {
        Map<String,String> result= new HashMap<>();
        Map<String,Object> claims=new HashMap<>();
        claims.put("currentUserEmailId",user.getEmailId());
        claims.put("currentUserName",user.getUserName());
        claims.put("currentUserRole",user.getRole());
        claims.put("currentUserAddress",user.getAddress());
        claims.put("currentUserZipCode",user.getZipCode());
        claims.put("currentUserMobileNo",user.getPhoneNo());
        claims.put("currentUserStatus",user.getStatus());
        claims.put("currentUserImage",user.getProfileImageFileName());

        String jwtToken=Jwts.builder() //generating token
                .setClaims(claims)
                .setSubject("user token")
                .setIssuer("authentication-app")
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256,"fridayitwillrain")
                .compact();
        result.put("token",jwtToken);
        result.put("message","Login success");
        return result;
    }

    @Override
    public Map<String, String> generateTokenAdmin(Admin admin) {
        Map<String,String> result= new HashMap<>();
        Map<String,Object> claims=new HashMap<>();
        claims.put("currentAdminEmailId",admin.getAdminId());
        claims.put("role",admin.getRole());

        String jwtToken=Jwts.builder() //generating token
                .setClaims(claims)
                .setSubject("Admin token")
                .setIssuer("authentication-app")
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256,"kuruvi")
                .compact();
        result.put("token",jwtToken);
        result.put("message","Admin login success");
        return result;
    }

    @Override
    public Map<String, String> generateTokenOwner(Owner owner) {
        Map<String,String> result= new HashMap<>();
        Map<String,Object> claims=new HashMap<>();
        claims.put("currentRestaurantEmailId",owner.getRestaurantEmailId());
        claims.put("currentOwnerName",owner.getOwnerName());
        claims.put("currentRestaurantName",owner.getRestaurantName());
        claims.put("currentOwnerRole",owner.getRole());
        claims.put("currentRestaurantAddress",owner.getAddress());
        claims.put("currentRestaurantZipCode",owner.getZipCode());
        claims.put("currentRestaurantMobileNo",owner.getPhoneNo());
        claims.put("currentRestaurantStatus",owner.getStatus());

        String jwtToken=Jwts.builder()
                .setClaims(claims)
                .setSubject("restaurant token")
                .setIssuer("authentication-app")
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256,"possible")
                .compact();
        result.put("token",jwtToken);
        result.put("message","Request shared to admin");
        return result;
    }
}
