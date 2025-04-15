// server/src/main/java/com/snappix/server/util/JwtUtil.java
// Utility class for generating and validating JWT tokens
package com.snappix.server.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.security.Key;
import java.util.Date;

@Component // Marks this class as a Spring-managed bean
public class JwtUtil {

    // A long secret key string (should be kept safe and ideally loaded from env variables)
    private static final String SECRET = "snappix-super-secret-key-that-is-long-enough-123";

    // Generate an HMAC SHA key from the secret (after Base64 encoding)
    private final Key key = Keys.hmacShaKeyFor(Base64.getEncoder().encode(SECRET.getBytes()));

    // Token validity period: 24 hours
    private final long expirationMs = 1000 * 60 * 60 * 24;

    // Generate a JWT token using user's email
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email) // sets email as subject
                .setIssuedAt(new Date()) // token issue time
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs)) // token expiry
                .signWith(key) // signs with the secret key
                .compact(); // builds the final token string
    }

    //  Extract email (subject) from a JWT token
    public String extractEmail(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key) // verify token using the same key
                .build()
                .parseClaimsJws(token) // parses the token
                .getBody(); // retrieves the claims (payload)

        return claims.getSubject(); // returns the email
    }
}
