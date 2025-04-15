// server/src/main/java/com/snappix/server/security/JwtAuthenticationFilter.java
package com.snappix.server.security;

import com.snappix.server.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component // Marks this as a Spring-managed component (so it can be injected)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    // Injects the JwtUtil used for token validation and extracting info
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // Called once per request to process the JWT token (if present)
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {

        // Extract the Authorization header
        String authHeader = request.getHeader("Authorization");

        // Check if the header is not empty and starts with "Bearer "
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            // Extract the JWT token from the header
            String token = authHeader.substring(7);

            try {
                // Use JwtUtil to validate the token and extract the email (subject)
                String email = jwtUtil.extractEmail(token);

                // Create an authentication token with the extracted email
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(email, null, null);

                // Set request details (like IP, session ID)
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the authentication in the SecurityContext so Spring Security knows the user is authenticated
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                // If token is invalid, do nothing. Request will proceed unauthenticated.
            }
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }
}
