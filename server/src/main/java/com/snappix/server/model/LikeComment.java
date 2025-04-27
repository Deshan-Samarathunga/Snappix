// src/main/java/com/snappix/server/model/LikeComment.java
package com.snappix.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "like_comments")
public class LikeComment {

    @Id
    private String id;

    private String postId;
    private String userEmail;
    private String text;
    private Date createdAt;

    // Flag for like
    private boolean liked;

    public LikeComment() {}

    public LikeComment(String postId, String userEmail, String text, boolean liked) {
        this.postId = postId;
        this.userEmail = userEmail;
        this.text = text;
        this.liked = liked;
        this.createdAt = new Date();
    }

    // ✅ Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }

    // ✅ Helper method to handle text JSON if necessary
    @JsonIgnore
    public void setTextFromJson(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.text = mapper.readValue(json, String.class);
        } catch (Exception e) {
            this.text = ""; // fallback to empty
        }
    }
}
