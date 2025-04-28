// server/src/main/java/com/snappix/server/config/SecurityConfig.java
package com.snappix.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import com.snappix.server.security.JwtAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // Enable default CORS

            .authorizeHttpRequests(auth -> auth
                // 🔓 Public endpoints
                .requestMatchers("/api/courses/**").permitAll()
                .requestMatchers("/api/auth/google").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()

                // 🔐 Protected endpoints
                .requestMatchers(HttpMethod.POST, "/api/posts/create").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/posts/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/posts/**").authenticated()

                .requestMatchers("/api/communities/**").authenticated()
                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
