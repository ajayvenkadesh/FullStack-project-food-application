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

public class JwtFilterForAdmin extends GenericFilterBean{
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ServletException("Missing or invalid Authorization header");
        } else {
            try {
                String token = authHeader.substring(7);
                Claims claims = Jwts.parser().setSigningKey("kuruvi").parseClaimsJws(token).getBody();

                // Log the extracted claims
                String adminEmailId = (String) claims.get("currentAdminEmailId");
                String role = (String) claims.get("role");

                System.out.println("Extracted adminEmailId: " + adminEmailId);
                System.out.println("Extracted role: " + role);

                // Set the extracted user info as request attributes
                request.setAttribute("adminEmailId", adminEmailId);
                request.setAttribute("adminRole", role);

                filterChain.doFilter(request, servletResponse);
            } catch (Exception e) {
                e.printStackTrace(); // Log any parsing issues
                throw new ServletException("Failed to parse JWT token");
            }
        }
    }
}

