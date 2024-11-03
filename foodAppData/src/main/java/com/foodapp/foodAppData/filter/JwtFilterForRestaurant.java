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

public class JwtFilterForRestaurant extends GenericFilterBean{
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Authorization header missing or invalid: " + authHeader);
            throw new ServletException("Missing or invalid Authorization header");
        } else {
            String token = authHeader.substring(7);
            System.out.println("Received Token: " + token);

            try {
                Claims claims = Jwts.parser()
                        .setSigningKey("possible") // Ensure key matches
                        .parseClaimsJws(token).getBody();

                // Extract and log claims
                String restaurantEmailId = (String) claims.get("currentRestaurantEmailId");
                String role = (String) claims.get("currentOwnerRole");

                System.out.println("Extracted restaurantEmailId: " + restaurantEmailId);
                System.out.println("Extracted role: " + role);

                // Set attributes for further use
                request.setAttribute("restaurantemailId", restaurantEmailId);
                request.setAttribute("restaurantRole", role);

                filterChain.doFilter(request, servletResponse);
            } catch (Exception e) {
                System.out.println("Error parsing JWT: " + e.getMessage());
                throw new ServletException("Invalid token");
            }
        }
    }
}
