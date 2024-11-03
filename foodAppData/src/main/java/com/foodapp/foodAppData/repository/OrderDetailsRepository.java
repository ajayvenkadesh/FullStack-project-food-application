package com.foodapp.foodAppData.repository;

import com.foodapp.foodAppData.model.OrderDetails;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderDetailsRepository extends MongoRepository<OrderDetails,String> {
    List<OrderDetails> findByUserEmailId(String userEmailId);

    List<OrderDetails> findByRestaurantEmailIdAndStatus(String restaurantEmailId, String status);

    List<OrderDetails> findByRestaurantEmailId(String restaurantEmailId);

    List<OrderDetails> findByRestaurantEmailIdAndStatus(String restaurantEmailId, OrderDetails.Status status);
}
