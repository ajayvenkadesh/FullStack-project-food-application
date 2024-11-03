package com.foodapp.foodAppData.service;

import com.foodapp.foodAppData.model.Admin;
import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.repository.AdminRepository;
import com.foodapp.foodAppData.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    RestaurantRepository restaurantRepository;

    @Override
    public List<Restaurant> getAllPendingRestaurants() {
        return restaurantRepository.findByIsApproved(Restaurant.Approval.PENDING);
    }
    @Override
    public Restaurant approveRestaurant(String restaurantEmailId) {
        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(restaurantEmailId);
        if (restaurantOpt.isPresent()) {
            Restaurant restaurant = restaurantOpt.get();
            restaurant.setIsApproved(Restaurant.Approval.APPROVED); // Set approval status to APPROVED
            return restaurantRepository.save(restaurant); // Save the updated restaurant
        }
        return null;
    }

    @Override
    public Restaurant denyRestaurant(String restaurantEmailId) {
        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(restaurantEmailId);
        if (restaurantOpt.isPresent()) {
            Restaurant restaurant = restaurantOpt.get();
            restaurant.setIsApproved(Restaurant.Approval.DENIED); // Set approval status to DENIED
            return restaurantRepository.save(restaurant); // Save the updated restaurant
        }
        return null;
    }

    @Override
    public Restaurant removeRestaurant(String restaurantEmailId) {
        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(restaurantEmailId);
        if (restaurantOpt.isPresent()) {
            Restaurant restaurant = restaurantOpt.get();
            restaurantRepository.delete(restaurant); // Remove the restaurant from the repository
            return restaurant; // Optionally return the deleted restaurant for reference
        }
        return null;
    }
}
