package com.foodapp.foodAppData.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document
public class RestaurantMenu {

    @Id
    private String itemId = UUID.randomUUID().toString(); // Automatically generates a unique ID

    private String restaurantEmailId; // To link to the Restaurant
    private String restaurantName;
    private String itemName;
    private String description;
    private ItemCategory itemCategory; // Changed to enum
    private ItemType itemType; // Changed to enum
    private int price;
    private String menuImageFileName; // Link to the item's image
    private int availableCount;

    @JsonProperty("isAvailable")
    private boolean isAvailable; // New field to check if item is available

    private int quantity;

    public enum ItemCategory {
        MAIN_COURSE, DESSERT, STARTER, BEVERAGE; // Example categories
    }

    public enum ItemType {
        VEG, NON_VEG; // Item type for menu items
    }
}
