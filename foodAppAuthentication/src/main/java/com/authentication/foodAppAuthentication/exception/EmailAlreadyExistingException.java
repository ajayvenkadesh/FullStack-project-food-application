package com.authentication.foodAppAuthentication.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(reason = "Email-ID Already existing",code = HttpStatus.NOT_ACCEPTABLE)
public class EmailAlreadyExistingException extends Exception{
}
