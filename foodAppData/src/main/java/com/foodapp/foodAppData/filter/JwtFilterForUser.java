package com.foodapp.foodAppData.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

public class JwtFilterForUser extends GenericFilterBean {
        @Override
        public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
                throws IOException, ServletException {
            HttpServletRequest request = (HttpServletRequest) servletRequest;
            String authHeader = request.getHeader("Authorization");



            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new ServletException("Missing or invalid Authorization header");
            } else {
                String token = authHeader.substring(7);
                Claims claims = Jwts.parser().setSigningKey("fridayitwillrain").parseClaimsJws(token).getBody();

                // Set the extracted user info as request attributes
                String emailId = (String) claims.get("currentUserEmailId");
                String role=(String)claims.get("currentUserRole");
                String userName=(String)claims.get("currentUserName");
                String userAddress=(String)claims.get("currentUserAddress");
                Long userPhoneNO=(Long) claims.get("currentUserMobileNo");

                System.out.println("Authorization Header: " + authHeader);
                System.out.println("Extracted Claims: " + claims);


                System.out.println("Extracted userEmailId: " + emailId);
                System.out.println("Extracted role: " + role);

                request.setAttribute("userEmailId", emailId);
                request.setAttribute("userRole",role);
                request.setAttribute("userName",userName);
                request.setAttribute("userAddress",userAddress);
                request.setAttribute("phoneNo",userPhoneNO);

                filterChain.doFilter(request, servletResponse);
            }
        }
    }

