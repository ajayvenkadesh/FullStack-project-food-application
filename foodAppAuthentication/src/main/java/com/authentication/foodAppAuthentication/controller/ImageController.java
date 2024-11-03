package com.authentication.foodAppAuthentication.controller;

import com.authentication.foodAppAuthentication.exception.ImageNotFoundException;
import com.authentication.foodAppAuthentication.exception.InvalidImageFormatException;
import com.authentication.foodAppAuthentication.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/profile-image")
public class ImageController {

    @Value("${upload.directory}")
    private String imageDir;

    @Autowired
    private FileService fileService;

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String filename) throws IOException {
        File image = fileService.getImageFileFromDisk(filename);
        if (!image.exists()) {
            throw new ImageNotFoundException("Image file not found for filename: " + filename);
        }

        Resource resource = new FileSystemResource(image);

        String contentType = Files.probeContentType(image.toPath());
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidImageFormatException("File is not a valid image type: " + filename);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, contentType);

        return ResponseEntity.ok().headers(headers).body(resource);
    }
}
