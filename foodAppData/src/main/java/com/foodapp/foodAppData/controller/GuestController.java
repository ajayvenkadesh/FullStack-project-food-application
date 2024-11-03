package com.foodapp.foodAppData.controller;

import com.foodapp.foodAppData.model.ResourceNotFoundException;
import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.model.RestaurantMenu;
import com.foodapp.foodAppData.repository.RestaurantMenuRepository;
import com.foodapp.foodAppData.repository.RestaurantRepository;
import com.foodapp.foodAppData.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest")
public class GuestController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private RestaurantMenuRepository restaurantMenuRepository;

    @Autowired
    RestaurantService restaurantService;

    // Get list of restaurants (for guest view)
    @GetMapping("/approved")
    public ResponseEntity<List<Restaurant>> getAllApprovedRestaurants() {
        List<Restaurant> approvedRestaurants = restaurantService.getAllApprovedRestaurants();
        return ResponseEntity.ok(approvedRestaurants);
    }

    // Get menu for a specific restaurant by restaurant emailId (for guest view)
    @GetMapping("/restaurants/menu/{restaurantEmailId}")
    public List<RestaurantMenu> getMenuByRestaurant(@PathVariable String restaurantEmailId) throws ResourceNotFoundException {
        Restaurant restaurant = restaurantRepository.findById(restaurantEmailId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        return restaurant.getRestaurantMenuList(); // Return the menu list
    }

    @GetMapping("/name")
    public ResponseEntity<List<Restaurant>> searchByRestaurantName(@RequestParam String name) {
        List<Restaurant> restaurants = restaurantService.searchRestaurantsByName(name);
        return ResponseEntity.ok(restaurants);
    }

    // Search restaurants by type (e.g., vegetarian, non-vegetarian)
    @GetMapping("/type")
    public ResponseEntity<List<Restaurant>> searchByRestaurantType(@RequestParam String type) {
        List<Restaurant> restaurants = restaurantService.searchRestaurantsByType(type);
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/search-by-menu-item")
    public ResponseEntity<?> searchRestaurantByMenuItem(@RequestParam String itemName) {
        // Validate the item name (for example, check if it's not empty or null)
        if (itemName == null || itemName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Item name cannot be empty.");
        }

        List<Restaurant> restaurants = restaurantService.searchRestaurantsByMenuItemName(itemName.trim());

        if (restaurants.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No restaurants found with the given menu item.");
        }

        return ResponseEntity.ok(restaurants);
    }



}

