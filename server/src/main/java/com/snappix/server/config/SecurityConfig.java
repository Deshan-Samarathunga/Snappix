// server/src/main/java/com/snappix/server/config/SecurityConfig.java
package com.snappix.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import com.snappix.server.security.JwtAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration // Marks this class as a Spring configuration class
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    // Injects the custom JWT filter via constructor
    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // Configures Spring Security's filter chain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF since the app uses stateless token authentication
            .csrf(csrf -> csrf.disable())

            // Enables CORS (Cross-Origin Resource Sharing)
            .cors(cors -> {})

            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Allow unauthenticated access to the Google login endpoint
                .requestMatchers("/api/auth/google").permitAll()
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )

            // Add the custom JWT filter before Spring Security's built-in authentication filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // Build and return the security filter chain
        return http.build();
    }
}
