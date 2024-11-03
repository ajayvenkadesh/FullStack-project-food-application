package com.authentication.foodAppAuthentication.service;

import com.authentication.foodAppAuthentication.exception.EmailAlreadyExistingException;
import com.authentication.foodAppAuthentication.exception.EmailIdNotFoundException;
import com.authentication.foodAppAuthentication.model.Owner;

public interface OwnerService {
    public abstract Owner addRestaurant(Owner owner) throws EmailAlreadyExistingException;

    public abstract Owner loginOwner(String emailId,String password) throws EmailIdNotFoundException;
}
