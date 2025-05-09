// src/main/java/com/snappix/server/model/Post.java
package com.snappix.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String userEmail;
    private String userName; // ✅ added
    private String community;
    private String description;
    private List<String> mediaUrls;
    private Date createdAt = new Date();

    public Post() {}

    public Post(String userEmail, String userName, String community, String description, List<String> mediaUrls) {
        this.userEmail = userEmail;
        this.userName = userName;
        this.community = community;
        this.description = description;
        this.mediaUrls = mediaUrls;
    }

    public String getId() { return id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getCommunity() { return community; }
    public void setCommunity(String community) { this.community = community; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
