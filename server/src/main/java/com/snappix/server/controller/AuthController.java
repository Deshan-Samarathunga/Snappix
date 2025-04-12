// server/src/main/java/com/snappix/server/controller/AuthController.java
package com.snappix.server.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String CLIENT_ID = "968315316960-1istdm8ck261a5u23iopbhbtr7jerpdl.apps.googleusercontent.com";

    @PostMapping("/google")
    public ResponseEntity<?> handleGoogleLogin(@RequestBody Map<String, String> body) throws Exception {
        String token = body.get("token");

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
            GoogleNetHttpTransport.newTrustedTransport(),
            GsonFactory.getDefaultInstance()
        )
        .setAudience(List.of(CLIENT_ID))
        .build();
        
        GoogleIdToken idToken = verifier.verify(token);
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            return ResponseEntity.ok(Map.of(
                    "user", Map.of(
                            "name", name,
                            "email", email,
                            "picture", picture
                    ),
                    "token", "your-jwt-token-here" // replace with real token later
            ));
        } else {
            return ResponseEntity.status(401).body("Invalid ID token.");
        }
    }
}
