package com.foodapp.foodAppData.repository;

import com.foodapp.foodAppData.model.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminRepository extends MongoRepository<Admin,String> {

}
