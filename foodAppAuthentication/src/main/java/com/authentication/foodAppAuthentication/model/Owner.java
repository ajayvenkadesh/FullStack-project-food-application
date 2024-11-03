//Owner class

package com.authentication.foodAppAuthentication.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Owner {

    @Id
    @Column(nullable = false)
    private String restaurantEmailId;
    @Column(nullable = false)
    private String restaurantName;
    @Column(nullable = false)
    private String ownerName;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String address,role,status;
    @Column(nullable = false)
    private long phoneNo;
    @Column(nullable = false)
    private int zipCode;
}
