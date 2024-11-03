package com.foodapp.foodAppData.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document
public class Restaurant {
    @Id
    private String restaurantEmailId;
    private String restaurantName;
    private float rating;
    private Approval isApproved; // Hard coded
    private RestaurantType type; // Veg or non-veg
    private RestaurantCategory category;
    private String location;
    private String contactNumber; // New field
    private String restaurantImageFileName;//
    private List<RestaurantMenu> restaurantMenuList=new ArrayList<>(); // The menu items associated with this restaurant
    private List<OrderDetails> orderDetailsList=new ArrayList<>();

    public enum Approval {
        PENDING, APPROVED, DENIED;
    }

    public enum RestaurantType {
        VEG, NON_VEG,BOTH;
    }

    public enum RestaurantCategory {
        FAST_FOOD, FINE_DINING, CASUAL_DINING, CAFE, OTHERS;
    }
}
