package com.foodapp.foodAppData.controller;

import com.foodapp.foodAppData.service.FileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private FileService fileService;

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    // Endpoint to get restaurant image
    @GetMapping("/restaurant/{restaurantEmailId}/{filename}")
    public ResponseEntity<?> getRestaurantImage(@PathVariable String restaurantEmailId, @PathVariable String filename) {
        try {
            File imageFile = fileService.getRestaurantImageFile(restaurantEmailId, filename);
            Resource resource = new FileSystemResource(imageFile);
            String contentType = Files.probeContentType(imageFile.toPath());

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, contentType);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
        } catch (FileNotFoundException e) {
            logger.error("Restaurant image not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Restaurant image not found.");
        } catch (IOException e) {
            logger.error("Error retrieving restaurant image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving restaurant image.");
        }
    }

    // Endpoint to get menu image
    @GetMapping("/menu/{restaurantEmailId}/{filename}")
    public ResponseEntity<?> getMenuImage(@PathVariable String restaurantEmailId, @PathVariable String filename) {
        try {
            File imageFile = fileService.getMenuImageFile(restaurantEmailId, filename);
            Resource resource = new FileSystemResource(imageFile);
            String contentType = Files.probeContentType(imageFile.toPath());
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, contentType);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
        } catch (FileNotFoundException e) {
            logger.error("Menu image not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Menu image not found.");
        } catch (IOException e) {
            logger.error("Error retrieving menu image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving menu image.");
        }
    }
}
