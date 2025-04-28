package com.snappix.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    // Use this for post author checks
    private String createdBy;

    private String userName;
    private String community;
    private String description;
    private List<String> mediaUrls;
    private Date createdAt = new Date();

    public Post() {}

    public Post(String createdBy, String userName, String community, String description, List<String> mediaUrls) {
        this.createdBy = createdBy;
        this.userName = userName;
        this.community = community;
        this.description = description;
        this.mediaUrls = mediaUrls;
    }

    public String getId() { return id; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

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
