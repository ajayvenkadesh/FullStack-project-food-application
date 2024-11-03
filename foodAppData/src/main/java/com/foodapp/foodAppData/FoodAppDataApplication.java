package com.foodapp.foodAppData;

import com.foodapp.foodAppData.filter.JwtFilterForAdmin;
import com.foodapp.foodAppData.filter.JwtFilterForRestaurant;
import com.foodapp.foodAppData.filter.JwtFilterForUser;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
public class FoodAppDataApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodAppDataApplication.class, args);

	}
	@Bean
	public FilterRegistrationBean<JwtFilterForUser> filterBeanUser() {
		FilterRegistrationBean<JwtFilterForUser> filterRegistrationBean = new FilterRegistrationBean<>();
		filterRegistrationBean.setFilter(new JwtFilterForUser());
		filterRegistrationBean.addUrlPatterns(
				"/api/orders/user/*",
				"/api/orders/place-order",
				"/api/add-cart/cart-details",
				"/api/add-cart/add-productToCart",
				"/api/add-cart/delete-productFromCart",
                "/api/add-cart/increaseQuantity/*",
                "/api/add-cart/decreaseQuantity/*",
                "/api/add-cart/clearCart/*",
                "/api/add-cart/removeItem/*"
				);
		return filterRegistrationBean;
	}

	// Filter for Admin
	@Bean
	public FilterRegistrationBean<JwtFilterForAdmin> filterBeanAdmin() {
		FilterRegistrationBean<JwtFilterForAdmin> filterRegistrationBean = new FilterRegistrationBean<>();
		filterRegistrationBean.setFilter(new JwtFilterForAdmin());
		filterRegistrationBean.addUrlPatterns(
				"/api/admin/pending",
				"/api/admin/approve/*",
				"/api/admin/deny/*",
				"/api/admin/remove/*");
		return filterRegistrationBean;
	}

	// Filter for Restaurant
	@Bean
	public FilterRegistrationBean<JwtFilterForRestaurant> filterBeanRestaurant() {
		FilterRegistrationBean<JwtFilterForRestaurant> filterRegistrationBean = new FilterRegistrationBean<>();
		filterRegistrationBean.setFilter(new JwtFilterForRestaurant());
		filterRegistrationBean.addUrlPatterns(
				"/api/restaurants/add",
				"/api/restaurants/update-menu/*",
				"/api/orders/restaurant/pending",
				"/api/orders/restaurant/approve/*",
				"/api/orders/restaurant/deny/*",
				"/api/restaurants/add-menu/*",
				"/api/restaurants/update-menu/*",
				"/api/restaurants/menu/*",
				"/api/orders/orderlist/*",
				"/api/orders/restaurant/approved-orders/*");
		return filterRegistrationBean;
	}

	@Bean
	public FilterRegistrationBean filterRegistrationBean(){
		final CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.addAllowedOrigin("http://localhost:3000");
		config.addAllowedHeader("*");
		config.addAllowedMethod("*");
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**",config);
		FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
		bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
		return bean;
	}

}
