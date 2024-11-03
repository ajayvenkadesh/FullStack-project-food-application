package com.foodapp.foodAppData.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.model.RestaurantMenu;
import com.foodapp.foodAppData.service.RestaurantService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/approved")
    public ResponseEntity<List<Restaurant>> getAllApprovedRestaurants() {
        List<Restaurant> approvedRestaurants = restaurantService.getAllApprovedRestaurants();
        return ResponseEntity.ok(approvedRestaurants);
    }

    @GetMapping("/{restaurantEmailId}")
    public ResponseEntity<Restaurant> getRestaurantByEmail(@PathVariable String restaurantEmailId) {

        Restaurant restaurant = restaurantService.getRestaurantByEmail(restaurantEmailId);
        if (restaurant != null) {
            return ResponseEntity.ok(restaurant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping(value = "/add", consumes = "multipart/form-data")
    public ResponseEntity<Restaurant> addRestaurantWithMenu(
            @RequestPart("restaurant") String restaurantJson,
            @RequestPart("restaurantImage") MultipartFile restaurantImage,
            @RequestPart("menuItems") String menuItemsJson,
            @RequestPart("menuImages") List<MultipartFile> menuImages,
            HttpServletRequest request) throws IOException {

        String role = (String) request.getAttribute("restaurantRole");
        String restaurantEmail = (String) request.getAttribute("restaurantemailId");

        // Convert JSON strings to objects
        ObjectMapper objectMapper = new ObjectMapper();
        Restaurant restaurant = objectMapper.readValue(restaurantJson, Restaurant.class);

        if (restaurantEmail != null) {
            restaurant.setRestaurantEmailId(restaurantEmail);
        }
        List<RestaurantMenu> menuItems = objectMapper.readValue(menuItemsJson, new TypeReference<List<RestaurantMenu>>() {});

        if (role != null && role.equalsIgnoreCase("OWNER") && restaurantEmail != null ) {
            // Call service to handle the restaurant and menu items
            Restaurant addedRestaurant = restaurantService.addRestaurantWithMenu(restaurant, restaurantImage, menuImages, menuItems);

            return ResponseEntity.ok(addedRestaurant);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Endpoint for the owner to update the restaurant menu
    @PutMapping("/update-menu/{restaurantEmailId}")
    public ResponseEntity<Restaurant> updateRestaurantMenu(
            @PathVariable String restaurantEmailId,
            @RequestBody RestaurantMenu updatedMenuItem,
            HttpServletRequest request) {

        String role = (String) request.getAttribute("restaurantRole");
        String restaurantEmail = (String) request.getAttribute("restaurantemailId");

        // Check if the role is 'OWNER' and the restaurant email matches
        if (role != null && role.equalsIgnoreCase("OWNER") && restaurantEmail != null && restaurantEmail.equals(restaurantEmailId)) {
            try {
                Restaurant updatedRestaurant = restaurantService.updateRestaurantMenu(restaurantEmailId, updatedMenuItem);
                return ResponseEntity.ok(updatedRestaurant);
            } catch (IllegalStateException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } else {
            // Unauthorized access: restaurant email doesn't match or the role isn't OWNER
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }



    @PostMapping("/add-menu/{restaurantEmailId}")
    public ResponseEntity<Restaurant> addMenuItem(
            @PathVariable String restaurantEmailId,
            @RequestPart("menuItem") String newMenuItemJson,
            @RequestPart("menuImage") List<MultipartFile> menuImages,  // List to handle multiple images
            HttpServletRequest request) {

        String role = (String) request.getAttribute("restaurantRole");
        String restaurantEmail = (String) request.getAttribute("restaurantemailId");
        try {
            // Check if the user role is OWNER and the email matches the restaurant
            if (role != null && role.equalsIgnoreCase("OWNER") && restaurantEmail != null && restaurantEmail.equals(restaurantEmailId)) {
                // Convert the JSON string into a list of RestaurantMenu objects
                ObjectMapper objectMapper = new ObjectMapper();
                List<RestaurantMenu> newMenuItems = objectMapper.readValue(newMenuItemJson, new TypeReference<List<RestaurantMenu>>() {});

                // Call the service method to add the menu items along with their images
                Restaurant updatedRestaurant = restaurantService.addMenuItem(restaurantEmailId, menuImages, newMenuItems);

                return ResponseEntity.ok(updatedRestaurant);
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Handle restaurant not found
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // Handle JSON parsing or image saving errors
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();  // Role or email mismatch
    }

    @GetMapping("/menu/{restaurantEmailId}")

    public ResponseEntity<List<RestaurantMenu>> getApprovedRestaurantMenu(@PathVariable String restaurantEmailId,HttpServletRequest request) {
        String role = (String) request.getAttribute("restaurantRole");
        String restaurantEmail = (String) request.getAttribute("restaurantemailId");
        List<RestaurantMenu> menuItems = restaurantService.getAllApprovedRestaurantMenu(restaurantEmailId);
        if (role != null && role.equalsIgnoreCase("OWNER") && restaurantEmail != null) {
            return ResponseEntity.ok(menuItems);
        }
        return ResponseEntity.notFound().build();
    }
}
