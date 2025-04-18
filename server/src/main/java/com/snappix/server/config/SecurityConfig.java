// server/src/main/java/com/snappix/server/config/SecurityConfig.java
package com.snappix.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import com.snappix.server.security.JwtAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;


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
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // enable default CORS
    
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/google").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/posts/create").authenticated()
                .requestMatchers("/api/posts/**").authenticated()
                .requestMatchers("/api/communities/**").authenticated()
                .anyRequest().authenticated()
            )
    
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    
        return http.build();
    }
    
}
