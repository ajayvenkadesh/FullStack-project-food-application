package com.foodapp.foodAppData.controller;

import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Fetch all pending restaurants for approval
    @GetMapping("/pending")
    public ResponseEntity<List<Restaurant>> getAllPendingRestaurants(HttpServletRequest request) {
        String role = (String) request.getAttribute("adminRole");
        String adminEmail = (String) request.getAttribute("adminEmailId");

        System.out.println(role + ""+ adminEmail);

        if (role != null && role.equalsIgnoreCase("ADMIN") && adminEmail != null) {
            List<Restaurant> pendingRestaurants = adminService.getAllPendingRestaurants();
            return ResponseEntity.ok(pendingRestaurants);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Approve a restaurant
    @PutMapping("/approve/{restaurantEmailId}")
    public ResponseEntity<Restaurant> approveRestaurant(@PathVariable String restaurantEmailId, HttpServletRequest request) {
        String role = (String) request.getAttribute("adminRole");
        String adminEmail = (String) request.getAttribute("adminEmailId");

        System.out.println(role);
        System.out.println(adminEmail);

        if (role != null && role.equalsIgnoreCase("ADMIN") && adminEmail != null) {
            Restaurant approvedRestaurant = adminService.approveRestaurant(restaurantEmailId);
            if (approvedRestaurant != null) {
                return ResponseEntity.ok(approvedRestaurant);
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Deny a restaurant
    @PutMapping("/deny/{restaurantEmailId}")
    public ResponseEntity<Restaurant> denyRestaurant(@PathVariable String restaurantEmailId, HttpServletRequest request) {
        String role = (String) request.getAttribute("adminRole");
        String adminEmail = (String) request.getAttribute("adminEmailId");

        if (role != null && role.equalsIgnoreCase("ADMIN") && adminEmail != null) {
            Restaurant deniedRestaurant = adminService.denyRestaurant(restaurantEmailId);
            if (deniedRestaurant != null) {
                return ResponseEntity.ok(deniedRestaurant);
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Endpoint to remove a restaurant
    @DeleteMapping("/remove/{restaurantEmailId}")
    public ResponseEntity<Restaurant> removeRestaurant(@PathVariable String restaurantEmailId,HttpServletRequest request) {
        String role = (String) request.getAttribute("adminRole");
        String adminEmail = (String) request.getAttribute("adminEmailId");

        if (role != null && role.equalsIgnoreCase("ADMIN") && adminEmail != null) {
            Restaurant removedRestaurant = adminService.removeRestaurant(restaurantEmailId);
            if (removedRestaurant != null) {
                return new ResponseEntity<>(removedRestaurant, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
