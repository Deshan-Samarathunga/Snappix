package com.snappix.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;
    private String postId;
    private String userEmail;
    private String content;
    private Date createdAt = new Date();

    public Comment() {}

    public Comment(String postId, String userEmail, String content) {
        this.postId = postId;
        this.userEmail = userEmail;
        this.content = content;
    }

    public String getId() { return id; }
    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
