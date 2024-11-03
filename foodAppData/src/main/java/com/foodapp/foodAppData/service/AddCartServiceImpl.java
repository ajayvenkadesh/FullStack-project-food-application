package com.foodapp.foodAppData.service;

import com.foodapp.foodAppData.model.AddCart;
import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.model.RestaurantMenu;
import com.foodapp.foodAppData.repository.AddCartRepository;
import com.foodapp.foodAppData.repository.RestaurantMenuRepository;
import com.foodapp.foodAppData.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AddCartServiceImpl implements AddCartService{

    @Autowired
    AddCartRepository addCartRepository;

    @Autowired
    RestaurantMenuRepository restaurantMenuRepository;

    @Autowired
    RestaurantRepository restaurantRepository;

    @Override
    public List<RestaurantMenu> getCartDetails(String emailId) {
        Optional<AddCart> cart = addCartRepository.findById(emailId);
        if (cart.isPresent()) {
            return cart.get().getRestaurantMenuList();
        } else {
            return new ArrayList<>();
        }
    }

    @Override
    public AddCart addMenuToCart(String emailId, RestaurantMenu restaurantMenu) {
        Optional<AddCart> existingCart = addCartRepository.findById(emailId);

        // Check if restaurantName is null and fetch it from the Restaurant collection
        if (restaurantMenu.getRestaurantName() == null) {
            Optional<Restaurant> restaurantOpt = restaurantRepository.findById(restaurantMenu.getRestaurantEmailId());
            if (restaurantOpt.isPresent()) {
                restaurantMenu.setRestaurantName(restaurantOpt.get().getRestaurantName());
            } else {
                throw new RuntimeException("Restaurant not found for emailId: " + restaurantMenu.getRestaurantEmailId());
            }
        }

        // Fetch full menu details from the database if required fields are null
        if (restaurantMenu.getItemCategory() == null || restaurantMenu.getItemType() == null || restaurantMenu.getMenuImageFileName() == null) {
            Optional<RestaurantMenu> fullMenuOpt = restaurantMenuRepository.findById(restaurantMenu.getItemId());
            if (fullMenuOpt.isPresent()) {
                RestaurantMenu fullMenu = fullMenuOpt.get();

                // Fill in the missing details from the full menu
                if (restaurantMenu.getItemCategory() == null) {
                    restaurantMenu.setItemCategory(fullMenu.getItemCategory());
                }
                if (restaurantMenu.getItemType() == null) {
                    restaurantMenu.setItemType(fullMenu.getItemType());
                }
                if (restaurantMenu.getMenuImageFileName() == null) {
                    restaurantMenu.setMenuImageFileName(fullMenu.getMenuImageFileName());
                }
            } else {
                throw new RuntimeException("Menu item not found for itemId: " + restaurantMenu.getItemId());
            }
        }

        if (existingCart.isPresent()) {
            AddCart cart = existingCart.get();
            List<RestaurantMenu> cartItems = cart.getRestaurantMenuList();
            boolean menuExists = false;

            // Ensure the restaurant is the same for all items in the cart
            if (!cartItems.isEmpty() &&
                    !cartItems.get(0).getRestaurantEmailId().equals(restaurantMenu.getRestaurantEmailId())) {
                    throw new RuntimeException("You cannot add items from multiple restaurants at the same time.");
            }

            for (RestaurantMenu p : cartItems) {
                if (p.getItemId().equals(restaurantMenu.getItemId())) {
                    menuExists = true;
                    // Update the quantity if the product already exists
                    p.setQuantity(p.getQuantity() + 1); // Increment quantity
                    break;
                }
            }

            // Add the product if it doesn't already exist
            if (!menuExists) {
                restaurantMenu.setQuantity(1); // Set quantity to 1 for new products
                cart.getRestaurantMenuList().add(restaurantMenu);
            }

            return addCartRepository.save(cart);
        } else {
            // Create a new cart if it doesn't exist for the user
            AddCart newCart = new AddCart();
            newCart.setEmailId(emailId);
            restaurantMenu.setQuantity(1); // Set quantity to 1 for new products
            newCart.getRestaurantMenuList().add(restaurantMenu);
            return addCartRepository.save(newCart);
        }
    }


    @Override
    public AddCart deleteMenuToCart(String emailId, RestaurantMenu restaurantMenu) {
        Optional<AddCart> existingCart = addCartRepository.findById(emailId);

        if (existingCart.isPresent()) {
            AddCart cart = existingCart.get();
            cart.getRestaurantMenuList().removeIf(p -> p.getItemId().equals(restaurantMenu.getItemId()));  // Remove the product by ID
            return addCartRepository.save(cart);  // Save the updated cart
        } else {
            throw new RuntimeException("Cart not found for user with email: " + emailId);
        }
    }

    @Override
    public Integer increaseCount(String emailId, String itemId) {
        Optional<AddCart> cartOpt = addCartRepository.findById(emailId);
        if (cartOpt.isPresent()) {
            AddCart cart = cartOpt.get();
            boolean itemFound = false; // To check if item was found
            for (RestaurantMenu item : cart.getRestaurantMenuList()) {
                if (item.getItemId().equals(itemId)) {
                    item.setQuantity(item.getQuantity() + 1); // Increment quantity
                    itemFound = true; // Set flag to true
                    break; // Exit loop as item has been found
                }
            }
            if (itemFound) {
                addCartRepository.save(cart);
                return 1;
            }
        }
        return 0; // Item or cart not found
    }

    @Override
    public Integer decreaseCount(String emailId, String itemId) {
        Optional<AddCart> cartOpt = addCartRepository.findById(emailId);
        if (cartOpt.isPresent()) {
            AddCart cart = cartOpt.get();
            cart.getRestaurantMenuList().forEach(item -> {
                if (item.getItemId().equals(itemId) && item.getQuantity() > 1) {
                    item.setQuantity(item.getQuantity() - 1);  // Decrement quantity
                }
            });
            addCartRepository.save(cart);
            return 1;
        }
        return 0;
    }

    @Override
    public void clearCart(String emailId) {
        Optional<AddCart> existingCart = addCartRepository.findById(emailId);
        if (existingCart.isPresent()) {
            AddCart cart = existingCart.get();
            cart.getRestaurantMenuList().clear();  // Clear all items in the cart
            addCartRepository.save(cart);          // Save the empty cart
        } else {
            throw new RuntimeException("Cart not found for user with email: " + emailId);
        }
    }

    @Override
    public AddCart removeItemFromCart(String emailId, String itemId) {
        System.out.println("Attempting to remove item with ID: " + itemId + " from cart of user: " + emailId);

        Optional<AddCart> existingCart = addCartRepository.findById(emailId);
        System.out.println("Existing cart found: " + existingCart);

        if (existingCart.isPresent()) {
            AddCart cart = existingCart.get();
            boolean removed = cart.getRestaurantMenuList().removeIf(item -> item.getItemId().equals(itemId)); // Remove item by ID
            if (!removed) {
                throw new RuntimeException("Item with ID: " + itemId + " not found in cart.");
            }
            System.out.println("Item removed. Updated cart: " + cart);
            return addCartRepository.save(cart);  // Save the updated cart
        } else {
            throw new RuntimeException("Cart not found for user with email: " + emailId);
        }
    }


}
