package com.foodapp.foodAppData.service;

import com.foodapp.foodAppData.model.OrderDetails;
import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.model.RestaurantMenu;
import com.foodapp.foodAppData.repository.OrderDetailsRepository;
import com.foodapp.foodAppData.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantServiceImpl implements RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    OrderDetailsRepository orderDetailsRepository;

    @Override
    public Restaurant getRestaurantByEmail(String restaurantEmailId) {
        return restaurantRepository.findByRestaurantEmailId(restaurantEmailId);
    }


    public List<Restaurant> getAllApprovedRestaurants() {
        return restaurantRepository.findByIsApproved(Restaurant.Approval.APPROVED);
    }

    @Override
    public List<RestaurantMenu> getAllApprovedRestaurantMenu(String restaurantEmailId) {
        // Fetch the restaurant by email ID
        Restaurant restaurant = restaurantRepository.findById(restaurantEmailId)
                .orElseThrow(() -> new IllegalStateException("Restaurant not found."));

        // Check if the restaurant is approved
        if (!restaurant.getIsApproved().equals(Restaurant.Approval.APPROVED)) {
            throw new IllegalStateException("Restaurant is not approved.");
        }

        // Return the list of approved menu items for the specific restaurant
        return restaurant.getRestaurantMenuList().stream()
                .filter(menuItem -> menuItem.isAvailable())  // Filter for available menu items
                .collect(Collectors.toList());
    }


    @Override
    public Restaurant addRestaurantWithMenu(Restaurant restaurant, MultipartFile restaurantImage, List<MultipartFile> menuImages, List<RestaurantMenu> menuList) throws IOException {
        // Check if the owner has already added a restaurant
        Restaurant existingRestaurant = restaurantRepository.findById(restaurant.getRestaurantEmailId()).orElse(null);
        if (existingRestaurant != null) {
            throw new IllegalStateException("Owner already has a restaurant. You can only add one restaurant.");
        }

        restaurant.setRestaurantImageFileName("default.jpg");
        restaurant.setIsApproved(Restaurant.Approval.PENDING);

        // Save restaurant image
        if (restaurantImage != null && !restaurantImage.isEmpty()) {
            String imageName = fileService.saveRestaurantImage(restaurantImage, restaurant.getRestaurantEmailId());
            restaurant.setRestaurantImageFileName(imageName);
        }

        // Initialize the restaurantMenuList if it's null
        if (restaurant.getRestaurantMenuList() == null) {
            restaurant.setRestaurantMenuList(new ArrayList<>());
        }

        // Save menu images
        if (menuImages != null && !menuImages.isEmpty() && menuList != null && !menuList.isEmpty()) {
            for (int i = 0; i < menuImages.size(); i++) {
                MultipartFile menuImage = menuImages.get(i);
                RestaurantMenu menuItem = menuList.get(i);

                if (menuImage != null && !menuImage.isEmpty()) {
                    String menuImageName = fileService.saveMenuImage(menuImage, restaurant.getRestaurantEmailId());
                    menuItem.setMenuImageFileName(menuImageName);
                } else {
                    menuItem.setMenuImageFileName("default.jpg");  // Default image if none provided
                }

                // Set restaurantEmailId for each menu item
                menuItem.setRestaurantEmailId(restaurant.getRestaurantEmailId());

                // Add the menu item to the restaurant's menu list
                restaurant.getRestaurantMenuList().add(menuItem);
            }
        }

        // Save the restaurant
        return restaurantRepository.save(restaurant);
    }


    // Method for editing the restaurant menu
    @Override
    public Restaurant updateRestaurantMenu(String restaurantEmailId, RestaurantMenu updatedMenuItem) {
        Restaurant restaurant = restaurantRepository.findById(restaurantEmailId).orElse(null);

        if (restaurant == null) {
            throw new IllegalStateException("Restaurant not found.");
        }

        List<RestaurantMenu> currentMenuList = restaurant.getRestaurantMenuList();
        boolean menuItemUpdated = false;

        for (RestaurantMenu currentMenuItem : currentMenuList) {
            if (currentMenuItem.getItemId().equals(updatedMenuItem.getItemId())) {
                // Only update the availableCount and isAvailable fields
                currentMenuItem.setAvailableCount(updatedMenuItem.getAvailableCount());

                if (updatedMenuItem.getAvailableCount() <= 0) {
                    currentMenuItem.setAvailable(false);
                } else {
                    currentMenuItem.setAvailable(true);
                }

                menuItemUpdated = true;
                break;
            }
        }

        if (!menuItemUpdated) {
            throw new IllegalStateException("Menu item not found.");
        }

        return restaurantRepository.save(restaurant);
    }




    @Override
    public Restaurant addMenuItem(String restaurantEmailId, List<MultipartFile> menuImages, List<RestaurantMenu> newMenuItems) throws IOException {
        // Find the restaurant by its email ID
        Restaurant restaurant = restaurantRepository.findById(restaurantEmailId).orElse(null);
        if (restaurant == null) {
            throw new IllegalStateException("Restaurant not found.");
        }

        // Initialize the restaurant's menu list if it's null
        if (restaurant.getRestaurantMenuList() == null) {
            restaurant.setRestaurantMenuList(new ArrayList<>());
        }

        // Iterate over the provided new menu items and save each
        for (int i = 0; i < newMenuItems.size(); i++) {
            RestaurantMenu menuItem = newMenuItems.get(i);

            // Check if there is a corresponding menu image for this menu item
            if (menuImages != null && i < menuImages.size()) {
                MultipartFile menuImage = menuImages.get(i);
                if (menuImage != null && !menuImage.isEmpty()) {
                    String menuImageName = fileService.saveMenuImage(menuImage, restaurantEmailId);
                    menuItem.setMenuImageFileName(menuImageName);  // Save the image filename
                } else {
                    menuItem.setMenuImageFileName("default.jpg");  // Set default image if no image is uploaded
                }
            } else {
                menuItem.setMenuImageFileName("default.jpg");  // Default image if no image is provided
            }

            // Set the restaurant email ID for the menu item
            menuItem.setRestaurantEmailId(restaurantEmailId);

            // Add the new menu item to the restaurant's menu list
            restaurant.getRestaurantMenuList().add(menuItem);
        }

        // Save the updated restaurant with the new menu items
        return restaurantRepository.save(restaurant);
    }



    @Override
    public List<Restaurant> searchRestaurantsByName(String restaurantName) {
        // Return only approved restaurants
        return restaurantRepository.findByRestaurantNameContainingIgnoreCaseAndIsApproved(restaurantName, Restaurant.Approval.APPROVED);
    }

    @Override
    public List<Restaurant> searchRestaurantsByType(String restaurantType) {
        // Return only approved restaurants
        return restaurantRepository.findByTypeContainingIgnoreCaseAndIsApproved(restaurantType, Restaurant.Approval.APPROVED);
    }

    @Override
    public List<Restaurant> searchRestaurantsByMenuItemName(String foodName) {
        return restaurantRepository.findRestaurantsByMenuItemName(foodName);
    }

}
