package com.foodapp.foodAppData.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document
public class OrderDetails {
    @Id
    private String orderId;
    private String userEmailId;
    private String restaurantEmailId;
    private String restaurantName;
    private List<RestaurantMenu> orderedItems = new ArrayList<>();
    private Status status;  // Use the enum type for status
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zip;
    private String landMark;
    private double totalAmount;

    public enum Status {
        PENDING, APPROVED, DENIED
    }

    public OrderDetails() {
        this.orderedItems = new ArrayList<>();
        this.status = Status.PENDING;  // Set default status to PENDING
    }

    public OrderDetails(String orderId, String userEmailId, String restaurantEmailId, String restaurantName, Status status, String phone, String address, String city, String state, String zip, String landMark, double totalAmount) {
        this.orderId = orderId;
        this.userEmailId = userEmailId;
        this.restaurantEmailId = restaurantEmailId;
        this.restaurantName = restaurantName;
        this.orderedItems = new ArrayList<>();
        this.status = status;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.landMark = landMark;
        this.totalAmount = totalAmount;
    }

    // Getters and setters
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getUserEmailId() {
        return userEmailId;
    }

    public void setUserEmailId(String userEmailId) {
        this.userEmailId = userEmailId;
    }

    public String getRestaurantEmailId() {
        return restaurantEmailId;
    }

    public void setRestaurantEmailId(String restaurantEmailId) {
        this.restaurantEmailId = restaurantEmailId;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public List<RestaurantMenu> getOrderedItems() {
        return orderedItems;
    }

    public void setOrderedItems(List<RestaurantMenu> orderedItems) {
        this.orderedItems = orderedItems;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getLandMark() {
        return landMark;
    }

    public void setLandMark(String landMark) {
        this.landMark = landMark;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
