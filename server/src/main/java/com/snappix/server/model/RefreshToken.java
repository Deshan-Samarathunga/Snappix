package com.snappix.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "refresh_tokens")
public class RefreshToken {

    @Id
    private String id;

    private String token;
    private String userEmail;

    public RefreshToken() {}

    public RefreshToken(String token, String userEmail) {
        this.token = token;
        this.userEmail = userEmail;
    }

    public String getId() { return id; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
