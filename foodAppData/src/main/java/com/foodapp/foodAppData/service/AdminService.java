package com.foodapp.foodAppData.service;

import com.foodapp.foodAppData.model.Restaurant;

import java.util.List;

public interface AdminService {

    public List<Restaurant> getAllPendingRestaurants();
    public Restaurant approveRestaurant(String restaurantEmailId);

    public Restaurant denyRestaurant(String restaurantEmailId);

    public Restaurant removeRestaurant(String restaurantEmailId);


}