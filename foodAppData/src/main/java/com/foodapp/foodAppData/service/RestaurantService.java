package com.foodapp.foodAppData.service;

import com.foodapp.foodAppData.model.OrderDetails;
import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.model.RestaurantMenu;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface RestaurantService {

    public Restaurant getRestaurantByEmail(String restaurantEmailId);
    public List<Restaurant> getAllApprovedRestaurants();
    //add restaurant with menu
    public List<RestaurantMenu> getAllApprovedRestaurantMenu(String restaurantEmailId);
    Restaurant addRestaurantWithMenu(Restaurant restaurant, MultipartFile restaurantImage, List<MultipartFile> menuImages, List<RestaurantMenu> menuList) throws IOException;
    public Restaurant updateRestaurantMenu(String restaurantEmailId, RestaurantMenu updatedMenuItem);
    public Restaurant addMenuItem(String restaurantEmailId, List<MultipartFile> menuImages, List<RestaurantMenu> newMenuItems) throws IOException;

    public List<Restaurant> searchRestaurantsByName(String restaurantName);

    // Search restaurants by type
    public List<Restaurant> searchRestaurantsByType(String restaurantType);

    // Search restaurants by menu item name
    public List<Restaurant> searchRestaurantsByMenuItemName(String foodName);

}
