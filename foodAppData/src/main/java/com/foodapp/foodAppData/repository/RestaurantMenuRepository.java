package com.foodapp.foodAppData.repository;

import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.model.RestaurantMenu;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RestaurantMenuRepository extends MongoRepository<RestaurantMenu,String> {
    List<RestaurantMenu> findByRestaurantEmailIdIgnoreCase(String restaurantEmailId);

}
