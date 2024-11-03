package com.authentication.foodAppAuthentication.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {
    @Value("${upload.directory}")
    private String imageDir;

    public String saveProfileImage(MultipartFile profileImage) throws IOException {
        String fileName = UUID.randomUUID() + "_" + profileImage.getOriginalFilename();

        File uploadFile = new File(imageDir + fileName);

        if (uploadFile.exists()) {
            fileName = UUID.randomUUID() + "_" + profileImage.getOriginalFilename();
            uploadFile = new File(imageDir + fileName);
        }

        try {
            profileImage.transferTo(uploadFile.toPath().normalize());
        } catch (IOException e) {
            throw e;
        }

        return fileName;
    }

    public File getImageFileFromDisk(String filename) throws FileNotFoundException {
        Path rootDirectory = Paths.get("").toAbsolutePath();
        File imageFile = new File(String.valueOf(rootDirectory.resolve(imageDir + filename).normalize()));
        if (!imageFile.exists()) {
            throw new FileNotFoundException();
        }
        return imageFile;
    }
}
