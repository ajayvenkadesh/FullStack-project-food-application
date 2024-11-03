package com.authentication.foodAppAuthentication.repository;

import com.authentication.foodAppAuthentication.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends JpaRepository<Owner,String> {
}
