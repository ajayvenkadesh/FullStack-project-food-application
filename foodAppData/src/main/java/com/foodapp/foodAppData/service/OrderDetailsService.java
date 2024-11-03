package com.foodapp.foodAppData.service;

import com.foodapp.foodAppData.model.OrderDetails;

import java.util.List;
import java.util.Optional;

public interface OrderDetailsService {
    public List<OrderDetails> getOrdersByUserEmail(String userEmailId);

    public List<OrderDetails> getPendingOrdersByRestaurant(String restaurantEmailId);

    public OrderDetails placeOrder(String userEmailId, String phone,
                                   String address, String city,
                                   String state, String zip, String landMark);


    public OrderDetails approveOrder(String restaurantEmailId, String orderId);

    public OrderDetails denyOrder(String restaurantEmailId, String orderId);

    //List of orderdetails for specific restaurant
    public List<OrderDetails> getOrderDetailsForRestaurant(String restaurantEmailId);

    public List<OrderDetails> getAllApprovedOrders(String restaurantEmailId);

    public Optional<OrderDetails> getOrderById(String orderId);
}
