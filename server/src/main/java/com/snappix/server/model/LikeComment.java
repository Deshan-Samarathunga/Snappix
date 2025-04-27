package com.snappix.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "likes")
public class LikeComment {

    @Id
    private String id;

    private String userEmail;
    private Date createdAt = new Date();

    private Post post;

    public LikeComment() {}

    public LikeComment(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }
}
