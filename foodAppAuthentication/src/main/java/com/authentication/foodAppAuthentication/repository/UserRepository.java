package com.authentication.foodAppAuthentication.repository;

import com.authentication.foodAppAuthentication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {

    Optional<User> findById(String emailId); // Ensure this returns an Optional<User>


    List<User> findByStatus(String status);


}
