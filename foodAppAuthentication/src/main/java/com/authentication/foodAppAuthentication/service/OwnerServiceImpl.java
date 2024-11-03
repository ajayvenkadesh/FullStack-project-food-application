package com.authentication.foodAppAuthentication.service;

import com.authentication.foodAppAuthentication.exception.EmailAlreadyExistingException;
import com.authentication.foodAppAuthentication.exception.EmailIdNotFoundException;
import com.authentication.foodAppAuthentication.model.Owner;
import com.authentication.foodAppAuthentication.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerServiceImpl implements OwnerService{

    @Autowired
    OwnerRepository ownerRepository;

    @Override
    public Owner addRestaurant(Owner owner) throws EmailAlreadyExistingException {
        if(ownerRepository.findById(owner.getRestaurantEmailId()).isEmpty()){
            owner.setRole("OWNER");
            owner.setStatus("Active");
            return ownerRepository.save(owner);
        }
        else{
            throw new EmailAlreadyExistingException();
        }
    }

    @Override
    public Owner loginOwner(String emailId, String password) throws EmailIdNotFoundException {
        List<Owner> owner=ownerRepository.findAll();
        return owner.stream().filter(ownerUser->ownerUser.getRestaurantEmailId()
                        .equals(emailId)&&ownerUser
                        .getPassword().equals(password)).findFirst()
                .orElseThrow(()->new EmailIdNotFoundException());
    }
}
