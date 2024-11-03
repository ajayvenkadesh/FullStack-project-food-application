package com.foodapp.foodAppData.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document
public class AddFavourite {
    @Id
    private String emailId;
    private List<Restaurant> favouriteItems = new ArrayList<>();

    public AddFavourite(String emailId) {
        this.emailId = emailId;
        this.favouriteItems = new ArrayList<>();
    }

    public AddFavourite() {
        this.favouriteItems = new ArrayList<>();
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public List<Restaurant> getFavouriteItems() {
        return favouriteItems;
    }

    public void setFavouriteItems(List<Restaurant> favouriteItems) {
        this.favouriteItems = favouriteItems;
    }
}
