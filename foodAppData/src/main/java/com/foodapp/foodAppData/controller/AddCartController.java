package com.foodapp.foodAppData.controller;

import com.foodapp.foodAppData.model.RestaurantMenu;
import com.foodapp.foodAppData.service.AddCartService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/add-cart")
public class AddCartController {
    @Autowired
    AddCartService addCartService;



    @GetMapping("/cart-details")
    public ResponseEntity<?> getAllProductFromCart(HttpServletRequest request) {

        String emailId = (String) request.getAttribute("userEmailId");
        System.out.println("reterived email:"+emailId);


        if (emailId == null) {
            return ResponseEntity.status(401).body("Unauthorized access.");
        }
        try {
            return new ResponseEntity<>(addCartService.getCartDetails(emailId), HttpStatus.OK);
        } catch (Exception e) {

            return new ResponseEntity<>("Error:"+ e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //http://localhost:8081/api/add-cart/add-productToCart POST

    @PostMapping("/add-productToCart")
    public ResponseEntity<?> addProductToCart(HttpServletRequest request, @RequestBody RestaurantMenu restaurantMenu) {

        // Retrieve role and emailId from the JWT (set by JwtFilter)
        String role = (String) request.getAttribute("userRole");
        String emailId = (String) request.getAttribute("userEmailId");

        // Check if the user has the ROLE_USER role and the email is valid
        if (role != null && role.equalsIgnoreCase("ROLE_USER") && emailId != null) {
            try {
                System.out.println(restaurantMenu);
                // Add the product to the cart and return a successful response
                return new ResponseEntity<>(addCartService.addMenuToCart(emailId, restaurantMenu), HttpStatus.CREATED);
            } catch (Exception e) {
                // In case of any issues, return an error response
                return new ResponseEntity<>("Error:"+ e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Error",HttpStatus.NOT_FOUND);
    }

    @PutMapping("/increaseQuantity/{emailId}/{itemId}")
    public ResponseEntity<String> increaseQuantity(@PathVariable String emailId, @PathVariable String itemId,HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        String emailIduser = (String) request.getAttribute("userEmailId");

        System.out.println("Extracted role: " + role); // Log the role
        System.out.println("Extracted emailIdUser: " + emailIduser); // Log the user email ID
        System.out.println("Path variable emailId: " + emailId);
        System.out.println("Path variable itemId: " + itemId);
        Integer result = addCartService.increaseCount(emailId, itemId);

        // Check if the user has the ROLE_USER role and the email is valid
        if (role != null && role.equalsIgnoreCase("ROLE_USER") && emailIduser != null) {
            if (result == 1) {
                return ResponseEntity.ok("Quantity increased successfully");
            } else {
                return ResponseEntity.badRequest().body("Failed to find item in cart");
            }
        }
        return ResponseEntity.badRequest().body("Failed to increase quantity");
    }

    @PutMapping("/decreaseQuantity/{emailId}/{itemId}")
    public ResponseEntity<String> decreaseQuantity(@PathVariable String emailId, @PathVariable String itemId,HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        String emailIdUser = (String) request.getAttribute("userEmailId");

        // Check if the user has the ROLE_USER role and the email is valid
        if (role != null && role.equalsIgnoreCase("ROLE_USER") && emailIdUser != null) {
            Integer result = addCartService.decreaseCount(emailId, itemId);
            if (result == 1) {
                return ResponseEntity.ok("Quantity decreased successfully");
            }
        }
        return ResponseEntity.badRequest().body("Failed to decrease quantity");
    }

    @PutMapping("/clearCart/{emailId}")
    public ResponseEntity<String> clearCart(@PathVariable String emailId,HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        String emailIdUser = (String) request.getAttribute("userEmailId");

        // Check if the user has the ROLE_USER role and the email is valid
        if (role != null && role.equalsIgnoreCase("ROLE_USER") && emailIdUser != null) {
            try {
                addCartService.clearCart(emailId);
                return ResponseEntity.ok("Cart cleared successfully.");
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
        return ResponseEntity.internalServerError().build();
    }

    @DeleteMapping("/removeItem/{emailId}/{itemId}")
    public ResponseEntity<?> removeItemFromCart(@PathVariable String emailId, @PathVariable String itemId,
                                                HttpServletRequest request) {

        String role = (String) request.getAttribute("userRole");
        String emailIdUser = (String) request.getAttribute("userEmailId");

        System.out.println(emailIdUser);
        System.out.println(role);

        // Ensure the user has the ROLE_USER role and the email matches
        if (role != null && role.equalsIgnoreCase("ROLE_USER") && emailIdUser != null && emailIdUser.equals(emailId)) {
            try {
                addCartService.removeItemFromCart(emailId, itemId);
                return ResponseEntity.ok("Item removed from cart successfully.");
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        } else {
            return ResponseEntity.status(403).body("Unauthorized to remove items from this cart.");
        }
    }

}
