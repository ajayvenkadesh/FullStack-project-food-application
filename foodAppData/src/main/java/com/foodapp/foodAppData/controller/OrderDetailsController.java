package com.foodapp.foodAppData.controller;

import com.foodapp.foodAppData.model.OrderDetails;
import com.foodapp.foodAppData.service.OrderDetailsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderDetailsController {

    @Autowired
    private OrderDetailsService orderDetailsService;

    @GetMapping("/orderlist/{restaurantEmailId}")
    public ResponseEntity<List<OrderDetails>> getOrderDetailsForRestaurant(@PathVariable String restaurantEmailId,HttpServletRequest request) {
        List<OrderDetails> orderDetailsList = orderDetailsService.getOrderDetailsForRestaurant(restaurantEmailId);

        String role = (String) request.getAttribute("restaurantRole");
        String restaurantEmail = (String) request.getAttribute("restaurantemailId");

        System.out.println(role);
        System.out.println(restaurantEmail);

        // Check if the user has the ROLE_USER role and the email is valid
        if (role != null && role.equalsIgnoreCase("OWNER") && restaurantEmail != null && restaurantEmail.equals(restaurantEmailId)){

            if (!orderDetailsList.isEmpty()) {
                return ResponseEntity.ok(orderDetailsList); // Return the list of order details
            } else {
                return ResponseEntity.noContent().build(); // Return a 204 status if no orders are found
            }
        }
        return ResponseEntity.ok().build();
    }


    // Endpoint to place an order
    @PostMapping("/place-order")
    public ResponseEntity<?> placeOrder(HttpServletRequest request,
                                        @RequestParam String phone,
                                        @RequestParam String address,
                                        @RequestParam String city,
                                        @RequestParam String state,
                                        @RequestParam String zip,
                                        @RequestParam String landMark) {
        // Retrieve role and emailId from the JWT (set by JwtFilter)
        String role = (String) request.getAttribute("userRole");
        String emailId = (String) request.getAttribute("userEmailId");

        System.out.println("Role: " + role);
        System.out.println("Email: " + emailId);
        System.out.println("Phone: " + phone);

        // Check if the user has the ROLE_USER role and the email is valid
        if (role != null && role.equalsIgnoreCase("ROLE_USER") && emailId != null) {
            try {
                OrderDetails order = orderDetailsService.placeOrder(emailId, phone, address, city, state, zip, landMark);
                return ResponseEntity.status(HttpStatus.CREATED).body(order);
            } catch (RuntimeException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid role or email");
    }


    // Endpoint to get all pending orders for a specific restaurant (OWNER ONLY)
    @GetMapping("/restaurant/pending")
    public ResponseEntity<?> getPendingOrders(HttpServletRequest request) {
        String role = (String) request.getAttribute("restaurantRole");
        String restaurantEmail = (String) request.getAttribute("restaurantemailId");

        // Check if the logged-in user is an OWNER
        if (role != null && role.equalsIgnoreCase("OWNER") && restaurantEmail != null) {
            List<OrderDetails> pendingOrders = orderDetailsService.getPendingOrdersByRestaurant(restaurantEmail);

            if (pendingOrders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.OK).body(null);
            }
            return ResponseEntity.ok(pendingOrders);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Return Forbidden if the user is not an owner
    }

    // Endpoint to approve an order (OWNER ONLY)
    @PutMapping("/restaurant/approve/{orderId}")
    public ResponseEntity<?> approveOrder(HttpServletRequest request, @PathVariable String orderId) {
        String role = (String) request.getAttribute("restaurantRole");
        String restaurantEmail = (String) request.getAttribute("restaurantemailId");

        // Logging to verify values
        System.out.println("Role: " + role);
        System.out.println("Restaurant Email: " + restaurantEmail);

        // Check if the logged-in user is an OWNER
        if (role != null && role.equalsIgnoreCase("OWNER") && restaurantEmail != null) {
            Optional<OrderDetails> approvedOrder = Optional.ofNullable(orderDetailsService.approveOrder(restaurantEmail, orderId));

            return approvedOrder.map(order -> ResponseEntity.ok(order))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // this is running
    }


    // Endpoint to deny an order (OWNER ONLY)
    @PutMapping("/restaurant/deny/{orderId}")
    public ResponseEntity<?> denyOrder(HttpServletRequest request, @PathVariable String orderId) {
        String role = (String) request.getAttribute("restaurantRole");
        String restaurantEmail = (String) request.getAttribute("restaurantemailId");

        // Check if the logged-in user is an OWNER
        if (role != null && role.equalsIgnoreCase("OWNER") && restaurantEmail != null) {
            Optional<OrderDetails> deniedOrder = Optional.ofNullable(orderDetailsService.denyOrder(restaurantEmail, orderId));

            return deniedOrder.map(order -> ResponseEntity.ok(order))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Return Forbidden if the user is not an owner
    }

    // Endpoint to get all orders by user email
    // Endpoint to get all orders by user email (USER viewing their own orders)
    @GetMapping("/user/{userEmailId}")
    public ResponseEntity<List<OrderDetails>> getOrdersByUserEmail(HttpServletRequest request, @PathVariable String userEmailId) {
        String role = (String) request.getAttribute("userRole");
        String emailId = (String) request.getAttribute("userEmailId");

        // Check if the logged-in user is an admin or the user is viewing their own orders
        if ((role != null && role.equalsIgnoreCase("ROLE_USER")) || (emailId != null && emailId.equals(userEmailId))) {
            List<OrderDetails> orders = orderDetailsService.getOrdersByUserEmail(userEmailId);

            if (orders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(orders);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Return Forbidden if the user is not authorized
    }

    @GetMapping("/restaurant/approved-orders/{restaurantEmailId}")
    public ResponseEntity<List<OrderDetails>> getApprovedOrdersForRestaurant(@PathVariable String restaurantEmailId,HttpServletRequest request) {

        String role = (String) request.getAttribute("restaurantRole");
        String restaurantEmail = (String) request.getAttribute("restaurantemailId");

        System.out.println(restaurantEmail);
        System.out.println(role);

        // Check if the logged-in user is an OWNER
        if (role != null && role.equalsIgnoreCase("OWNER") && restaurantEmail != null) {

            List<OrderDetails> approvedOrders = orderDetailsService.getAllApprovedOrders(restaurantEmailId);

            if (!approvedOrders.isEmpty()) {
                return ResponseEntity.ok(approvedOrders); // Return the list of approved orders
            } else {
                return ResponseEntity.noContent().build(); // Return a 204 status if no approved orders are found
            }
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetails> getOrderById(@PathVariable String orderId,HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        String emailId = (String) request.getAttribute("userEmailId");

        // Check if the logged-in user is an admin or the user is viewing their own orders
        if ((role != null && role.equalsIgnoreCase("ROLE_USER")) || (emailId != null)) {
            return orderDetailsService.getOrderById(orderId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.internalServerError().build();
    }
}
