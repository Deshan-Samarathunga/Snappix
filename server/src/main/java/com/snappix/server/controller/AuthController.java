// server/src/main/java/com/snappix/server/controller/AuthController.java
package com.snappix.server.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.snappix.server.model.RefreshToken;
import com.snappix.server.repository.RefreshTokenRepository;
import com.snappix.server.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenRepository refreshTokenRepo;

    private static final String CLIENT_ID = "968315316960-1istdm8ck261a5u23iopbhbtr7jerpdl.apps.googleusercontent.com";

    @PostMapping("/google")
    public ResponseEntity<?> handleGoogleLogin(@RequestBody Map<String, String> body, HttpServletResponse response) throws Exception {
        String token = body.get("token");

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(List.of(CLIENT_ID))
                .build();

        GoogleIdToken idToken = verifier.verify(token);

        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            String accessToken = jwtUtil.generateToken(email, 30); // 30 min access token
            String refreshToken = jwtUtil.generateToken(email, 60 * 24 * 7); // 7 days refresh token

            refreshTokenRepo.save(new RefreshToken(refreshToken, email));

            Cookie cookie = new Cookie("refreshToken", refreshToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // ✅ Enable for production HTTPS
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 7);
            cookie.setAttribute("SameSite", "None"); // ✅ Important for cross-origin requests
            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of(
                    "user", Map.of("name", name, "email", email, "picture", picture),
                    "accessToken", accessToken
            ));
        } else {
            return ResponseEntity.status(401).body("Invalid ID token.");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || !jwtUtil.isTokenValid(refreshToken)) {
            return ResponseEntity.status(401).body("Invalid or missing refresh token");
        }

        Optional<RefreshToken> savedToken = refreshTokenRepo.findByToken(refreshToken);
        if (savedToken.isEmpty()) {
            return ResponseEntity.status(403).body("Token no longer valid");
        }

        String email = jwtUtil.extractEmail(refreshToken);
        String newAccessToken = jwtUtil.generateToken(email, 5); // regenerate access token

        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken, HttpServletResponse response) {
        if (refreshToken != null) {
            refreshTokenRepo.deleteByToken(refreshToken); // 🔐 Revoke refresh token

            Cookie cookie = new Cookie("refreshToken", null); // clear cookie
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // ✅ for production
            cookie.setPath("/");
            cookie.setMaxAge(0);
            cookie.setAttribute("SameSite", "None");
            response.addCookie(cookie);
        }

        return ResponseEntity.ok("Logged out successfully");
    }
}
