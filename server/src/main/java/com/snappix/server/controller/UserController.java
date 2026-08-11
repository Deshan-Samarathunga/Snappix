package com.snappix.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController // Indicates that this class is a REST controller and handles HTTP requests
@RequestMapping("/api/user") // Base URL path for all endpoints in this controller
public class UserController {

    @GetMapping("/me") // Endpoint: GET /api/user/me
    public ResponseEntity<?> getLoggedInUser() {
        // Retrieves the current authenticated user's email (set as the subject in the JWT)
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Returns the email in a simple JSON map
        return ResponseEntity.ok(Map.of("email", email));
    }
}
