
package com.authentication.foodAppAuthentication.controller;

import com.authentication.foodAppAuthentication.CustomMessage.Message;
import com.authentication.foodAppAuthentication.exception.EmailAlreadyExistingException;
import com.authentication.foodAppAuthentication.exception.EmailIdNotFoundException;
import com.authentication.foodAppAuthentication.model.Owner;
import com.authentication.foodAppAuthentication.service.OwnerService;
import com.authentication.foodAppAuthentication.tokenGeneration.GenerateJwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/restaurant-Api")
public class OwnerController {
    @Autowired
    OwnerService ownerService;
    @Autowired
    GenerateJwt generateJwt;


    @PostMapping(value = "/signup-owner", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> addRestaurant(@RequestBody Owner owner) throws EmailAlreadyExistingException {
        System.out.println("Received request to register owner: " + owner);
        return new ResponseEntity<>(ownerService.addRestaurant(owner), HttpStatus.CREATED);
    }

    @PostMapping("/login-owner")
    public ResponseEntity <?>loginCheck(@RequestBody Owner owner) throws EmailIdNotFoundException {
        try {
            Owner result = ownerService.loginOwner(owner.getRestaurantEmailId(), owner.getPassword());
            result.setPassword(null);
            return new ResponseEntity<>(generateJwt.generateTokenOwner(result), HttpStatus.OK);

        }
        catch (EmailIdNotFoundException e) {
            Message msg = new Message("Error", "Login failed:"+e.getMessage());
            return new ResponseEntity<>(msg, HttpStatus.NOT_FOUND);
        }
    }
}
