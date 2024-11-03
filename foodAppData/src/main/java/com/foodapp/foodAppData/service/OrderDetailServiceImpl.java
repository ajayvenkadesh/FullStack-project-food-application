package com.foodapp.foodAppData.service;

import com.foodapp.foodAppData.model.AddCart;
import com.foodapp.foodAppData.model.OrderDetails;
import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.model.RestaurantMenu;
import com.foodapp.foodAppData.repository.AddCartRepository;
import com.foodapp.foodAppData.repository.OrderDetailsRepository;
import com.foodapp.foodAppData.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderDetailServiceImpl implements OrderDetailsService{

    @Autowired
    private AddCartRepository addCartRepository;

    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private JavaMailSender mailSender;

        @Value("${spring.mail.username")
        private String sender;
    @Override
    public List<OrderDetails> getOrdersByUserEmail(String userEmailId) {
        return orderDetailsRepository.findByUserEmailId(userEmailId);
    }

    @Override
    public List<OrderDetails> getOrderDetailsForRestaurant(String restaurantEmailId) {
        return orderDetailsRepository.findByRestaurantEmailId(restaurantEmailId);
    }

    @Override
    public List<OrderDetails> getAllApprovedOrders(String restaurantEmailId) {
        return orderDetailsRepository.findByRestaurantEmailIdAndStatus(restaurantEmailId, OrderDetails.Status.APPROVED);
    }

    // Get pending orders for a specific restaurant
    @Override
    public List<OrderDetails> getPendingOrdersByRestaurant(String restaurantEmailId) {
        return orderDetailsRepository.findByRestaurantEmailIdAndStatus(restaurantEmailId, "PENDING");
    }



    @Override
    public OrderDetails placeOrder(String userEmailId, String phone, String address, String city, String state, String zip, String landMark) {
        Optional<AddCart> cartOpt = addCartRepository.findById(userEmailId);

        if (cartOpt.isPresent()) {
            AddCart cart = cartOpt.get();
            List<RestaurantMenu> cartItems = cart.getRestaurantMenuList();

            // Ensure all items are from the same restaurant
            if (cartItems.stream().map(RestaurantMenu::getRestaurantEmailId).distinct().count() > 1) {
                throw new RuntimeException("You can only place an order for one restaurant at a time.");
            }

            // Check item availability and ensure requested quantity is in stock using latest data from the restaurant's menu
            String restaurantEmailId = cartItems.get(0).getRestaurantEmailId();
            Optional<Restaurant> restaurantOpt = restaurantRepository.findById(restaurantEmailId);

            if (restaurantOpt.isPresent()) {
                Restaurant restaurant = restaurantOpt.get();

                for (RestaurantMenu cartItem : cartItems) {
                    Optional<RestaurantMenu> menuItemOpt = restaurant.getRestaurantMenuList().stream()
                            .filter(menuItem -> menuItem.getItemId().equals(cartItem.getItemId()))
                            .findFirst();

                    if (menuItemOpt.isPresent()) {
                        RestaurantMenu menuItem = menuItemOpt.get();

                        System.out.println("Checking item: " + menuItem.getItemName() + " | Cart Quantity: " + cartItem.getQuantity() + " | AvailableCount: " + menuItem.getAvailableCount());

                        if (cartItem.getQuantity() > menuItem.getAvailableCount()) {
                            throw new RuntimeException("Item " + menuItem.getItemName() + " is out of stock.");
                        }

//                        // Check if the cart quantity exceeds available stock
//                        if (!menuItem.isAvailable() || cartItem.getQuantity() > menuItem.getAvailableCount()) {
//                            throw new RuntimeException("Item " + menuItem.getItemName() + " is out of stock.");
//                        }

                        // Update available count after placing order
                        menuItem.setAvailableCount(menuItem.getAvailableCount() - cartItem.getQuantity());

                        // Mark the item as unavailable if it runs out of stock
                        if (menuItem.getAvailableCount() == 0) {
                            menuItem.setAvailable(false);
                        }
                    } else {
                        throw new RuntimeException("Item " + cartItem.getItemName() + " not found in restaurant menu.");
                    }
                }

                double totalAmount = calculateTotalAmount(cartItems);

                // Create and save the order
                OrderDetails order = new OrderDetails();
                order.setUserEmailId(userEmailId);
                order.setRestaurantEmailId(restaurant.getRestaurantEmailId());
                order.setRestaurantName(restaurant.getRestaurantName());
                order.setOrderedItems(new ArrayList<>(cartItems));
                order.setStatus(OrderDetails.Status.PENDING);
                order.setPhone(phone);
                order.setAddress(address);
                order.setCity(city);
                order.setState(state);
                order.setZip(zip);
                order.setLandMark(landMark);
                order.setTotalAmount(totalAmount);

                OrderDetails savedOrder = orderDetailsRepository.save(order);

                restaurant.getOrderDetailsList().add(savedOrder);
                restaurantRepository.save(restaurant);

                // Clear the cart after placing order
                cart.getRestaurantMenuList().clear();
                addCartRepository.save(cart);

                String restaurantOwnerEmail = order.getRestaurantEmailId(); // Replace with actual logic to get the owner's email

                System.out.println(restaurantEmailId);

                // Send email notification to the restaurant owner
                sendOrderNotificationEmail(restaurantOwnerEmail, order);

                return savedOrder;
            } else {
                throw new RuntimeException("Restaurant not found for email: " + restaurantEmailId);
            }
        }

        throw new RuntimeException("No items found in the cart for user: " + userEmailId);
    }

    private void sendOrderNotificationEmail(String restaurantOwnerEmail, OrderDetails order) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(sender);
        message.setTo(restaurantOwnerEmail);
        message.setSubject("New Order Pending: " + order.getOrderId());
        message.setText("You have a new order pending for approval.\n\nOrder Details:\n" +
                "Order ID: " + order.getOrderId() + "\n" +
                "Order item" + order.getOrderedItems()+ "\n"+
                "Customer Email: " + order.getUserEmailId() + "\n" +
                "Total Amount: ₹" + order.getTotalAmount() + "\n" +
                "Please log in to the restaurant panel to review the order.");

        mailSender.send(message);
    }


    @Override
    public OrderDetails approveOrder(String restaurantEmailId, String orderId) {
        Optional<OrderDetails> orderOpt = orderDetailsRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            OrderDetails order = orderOpt.get();
            if (order.getRestaurantEmailId().equals(restaurantEmailId)) {
                order.setStatus(OrderDetails.Status.APPROVED);
                OrderDetails savedOrder = orderDetailsRepository.save(order);

                // Send email notification to the user
                sendOrderStatusNotification(order.getUserEmailId(), order, "approved");

                return savedOrder;
            } else {
                throw new RuntimeException("Order does not belong to the specified restaurant.");
            }
        }
        throw new RuntimeException("Order not found.");
    }

    // Deny order method
    @Override
    public OrderDetails denyOrder(String restaurantEmailId, String orderId) {
        Optional<OrderDetails> orderOpt = orderDetailsRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            OrderDetails order = orderOpt.get();
            if (order.getRestaurantEmailId().equals(restaurantEmailId)) {
                order.setStatus(OrderDetails.Status.DENIED);
                OrderDetails savedOrder = orderDetailsRepository.save(order);

                // Send email notification to the user
                sendOrderStatusNotification(order.getUserEmailId(), order, "denied");

                return savedOrder;
            } else {
                throw new RuntimeException("Order does not belong to the specified restaurant.");
            }
        }
        throw new RuntimeException("Order not found.");
    }

    // Method to send order status notification email
    private void sendOrderStatusNotification(String userEmail, OrderDetails order, String status) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(sender);
        message.setTo(userEmail);
        if (order.getStatus().equals("denied")) {
            message.setSubject("Your order has been " + status);
            message.setText("Hello, \n\nYour order with Order ID: " + order.getOrderId() + order.getOrderedItems()+
                    " has been " + status + "please contact restaurant" + ".\n\nThank you for using our service!");
        }
        message.setSubject("Your order has been " + status);
        message.setText("Hello, \n\nYour order with Order ID: " + order.getOrderId() + order.getOrderedItems()+
                " has been " + status + ".\n\nThank you for using our service!");
        mailSender.send(message);
    }


    // Method to calculate total amount
    private double calculateTotalAmount(List<RestaurantMenu> menuItems) {
        return menuItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity()) // Consider both price and quantity
                .sum();
    }

    @Override
    public Optional<OrderDetails> getOrderById(String orderId) {
        return orderDetailsRepository.findById(orderId);
    }

}
