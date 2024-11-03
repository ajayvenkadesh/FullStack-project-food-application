package com.foodapp.foodAppData.repository;

import com.foodapp.foodAppData.model.AddCart;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AddCartRepository extends MongoRepository<AddCart,String> {

}
