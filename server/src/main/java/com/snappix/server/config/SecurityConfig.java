// server/src/main/java/com/snappix/server/config/SecurityConfig.java
package com.snappix.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // enable CORS support
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/google").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
