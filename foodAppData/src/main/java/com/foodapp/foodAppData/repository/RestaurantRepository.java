package com.foodapp.foodAppData.repository;

import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.model.RestaurantMenu;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurant,String> {
    Restaurant findByRestaurantEmailId(String restaurantEmailID);
    List<Restaurant> findByIsApproved(Restaurant.Approval isApproved);

    List<Restaurant> findByRestaurantNameContainingIgnoreCaseAndIsApproved(String restaurantName, Restaurant.Approval approval);

    // Search approved restaurants by type
    List<Restaurant> findByTypeContainingIgnoreCaseAndIsApproved(String restaurantType, Restaurant.Approval approval);

    @Query("SELECT r FROM Restaurant r JOIN r.restaurantMenuList m WHERE LOWER(m.itemName) LIKE LOWER(CONCAT('%', :itemName, '%'))")
    List<Restaurant> findRestaurantsByMenuItemName(@Param("itemName") String itemName);



}
