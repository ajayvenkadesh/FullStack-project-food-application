package com.foodapp.foodAppData.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;


@Document
public class AddCart {
    @Id
    String emailId;

    String restaurantEmailId;
    List<RestaurantMenu> restaurantMenuList=new ArrayList<>();



    public AddCart(String emailId) {
        this.emailId = emailId;
        this.restaurantMenuList = new ArrayList<>();
    }
    public AddCart() {
        this.restaurantMenuList = new ArrayList<>();
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public List<RestaurantMenu> getRestaurantMenuList() {
        return restaurantMenuList;
    }

    public void setRestaurantMenuList(List<RestaurantMenu> restaurantMenuList) {
        this.restaurantMenuList = restaurantMenuList;
    }
}
