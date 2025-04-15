// server/src/main/java/com/snappix/server/controller/AuthController.java
// AuthController.java — Handles Google OAuth and JWT issuance
package com.snappix.server.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.snappix.server.util.JwtUtil;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth") // Base URL for auth routes
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil; // JWT generator utility

    // Google OAuth 2.0 Client ID (verify incoming tokens against this)
    private static final String CLIENT_ID = "968315316960-1istdm8ck261a5u23iopbhbtr7jerpdl.apps.googleusercontent.com";

    @PostMapping("/google") // Route: /api/auth/google (for login)
    public ResponseEntity<?> handleGoogleLogin(@RequestBody Map<String, String> body) throws Exception {
        String token = body.get("token"); // Extract token from request body

        // Build a token verifier to validate the Google ID token
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(List.of(CLIENT_ID)) // Token must be intended for this app
                .build();

        GoogleIdToken idToken = verifier.verify(token); // Verify authenticity of token

        if (idToken != null) {
            // Extract user info from the valid token payload
            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            // Respond with user data + signed JWT token for client use
            return ResponseEntity.ok(Map.of(
                    "user", Map.of(
                            "name", name,
                            "email", email,
                            "picture", picture),
                    "token", jwtUtil.generateToken(email) //  create a JWT for this user
            ));
        } else {
            // If token is invalid
            return ResponseEntity.status(401).body("Invalid ID token.");
        }
    }
}
