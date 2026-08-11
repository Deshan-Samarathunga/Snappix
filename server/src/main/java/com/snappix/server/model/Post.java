// src/main/java/com/snappix/server/model/Post.java
package com.snappix.server.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.ElementCollection;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userEmail;
    private String userName;
    private String community;
    private String description;
    
    @ElementCollection
    private List<String> mediaUrls;
    private Date createdAt = new Date();

    // Crosspost fields
    private String originalPostId;
    private String originalCommunity;

    public Post() {}

    public Post(String userEmail, String userName, String community, String description, List<String> mediaUrls) {
        this.userEmail = userEmail;
        this.userName = userName;
        this.community = community;
        this.description = description;
        this.mediaUrls = mediaUrls;
        this.createdAt = new Date();
    }

    // Getters & Setters
    public String getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getCommunity() {
        return community;
    }

    public void setCommunity(String community) {
        this.community = community;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getOriginalPostId() {
        return originalPostId;
    }

    public void setOriginalPostId(String originalPostId) {
        this.originalPostId = originalPostId;
    }

    public String getOriginalCommunity() {
        return originalCommunity;
    }

    public void setOriginalCommunity(String originalCommunity) {
        this.originalCommunity = originalCommunity;
    }
}
