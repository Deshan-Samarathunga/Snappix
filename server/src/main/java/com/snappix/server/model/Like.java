package com.snappix.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "likes")
public class Like {

    @Id
    private String id;

    private String postId;
    private String userEmail;

    public Like() {}

    public Like(String postId, String userEmail) {
        this.postId = postId;
        this.userEmail = userEmail;
    }

    public String getId() { return id; }

    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
