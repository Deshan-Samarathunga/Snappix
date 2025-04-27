package com.snappix.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;
    private String postId; // The ID of the post the comment belongs to
    private String userEmail; // The email of the user who made the comment
    private String text; // The comment text
    private Date createdAt = new Date();

    public Comment() {}

    public Comment(String postId, String userEmail, String text) {
        this.postId = postId;
        this.userEmail = userEmail;
        this.text = text;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
