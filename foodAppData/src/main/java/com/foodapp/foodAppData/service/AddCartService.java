package com.foodapp.foodAppData.service;

import com.foodapp.foodAppData.model.AddCart;
import com.foodapp.foodAppData.model.RestaurantMenu;

import java.util.List;

public interface AddCartService {
    List<RestaurantMenu> getCartDetails(String emailId);
    AddCart addMenuToCart(String emailId,RestaurantMenu restaurantMenu);
    AddCart deleteMenuToCart(String emailId, RestaurantMenu restaurantMenu);

    Integer increaseCount(String emailId, String itemId);

    Integer decreaseCount(String emailId, String itemId);

    void clearCart(String emailId);

    AddCart removeItemFromCart(String emailId, String itemId);
}
