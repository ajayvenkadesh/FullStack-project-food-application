package com.foodapp.foodAppData.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    @Value("${upload.directory.restaurant}")
    private String restaurantImageDir;

    @Value("${upload.directory.menu}")
    private String menuImageDir;

    // Save restaurant image to the specified directory
    public String saveRestaurantImage(MultipartFile profileImage, String restaurantEmailId) throws IOException {
        String fileName = UUID.randomUUID() + "_" + profileImage.getOriginalFilename();
        String folderPath = restaurantImageDir + restaurantEmailId + File.separator;

        File uploadDir = new File(folderPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs(); // Create directory if it doesn't exist
        }

        File uploadFile = new File(folderPath + fileName);
        profileImage.transferTo(uploadFile.toPath().normalize());

        return fileName;
    }

    // Save menu image to the specified directory
    public String saveMenuImage(MultipartFile menuImage, String restaurantEmailId) throws IOException {
        String fileName = UUID.randomUUID() + "_" + menuImage.getOriginalFilename();
        String folderPath = menuImageDir + restaurantEmailId + File.separator;

        File uploadDir = new File(folderPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs(); // Create directory if it doesn't exist
        }

        File uploadFile = new File(folderPath + fileName);
        menuImage.transferTo(uploadFile.toPath().normalize());

        return fileName;
    }

    // Get restaurant image URL
    public String getRestaurantImageUrl(String restaurantEmailId, String restaurantImageFileName) {
        String baseUrl = "http://localhost:8081/restaurant-image/";
        return baseUrl + restaurantEmailId + "/" + restaurantImageFileName;
    }

    // Get menu image URL
    public String getMenuImageUrl(String restaurantEmailId, String menuImageFileName) {
        String baseUrl = "http://localhost:8081/menu-image/";
        return baseUrl + restaurantEmailId + "/" + menuImageFileName;
    }

    // Retrieve restaurant image from disk
    public File getRestaurantImageFile(String restaurantEmailId, String filename) throws FileNotFoundException {
        File imageFile = new File(restaurantImageDir + restaurantEmailId + File.separator + filename);
        if (!imageFile.exists()) {
            throw new FileNotFoundException();
        }
        return imageFile;
    }

    // Retrieve menu image from disk
    public File getMenuImageFile(String restaurantEmailId, String filename) throws FileNotFoundException {
        File imageFile = new File(menuImageDir + restaurantEmailId + File.separator + filename);
        if (!imageFile.exists()) {
            throw new FileNotFoundException();
        }
        return imageFile;
    }
}
