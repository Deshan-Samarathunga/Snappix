package com.snappix.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "courses")
public class Course {

    @Id
    private String id;

    private String title;
    private String description;
    private String instructorEmail;
    private String instructorName;
    private List<String> mediaUrls; // course videos, thumbnails, etc
    private Date createdAt = new Date();

    public Course() {}

    public Course(String title, String description, String instructorEmail, String instructorName, List<String> mediaUrls) {
        this.title = title;
        this.description = description;
        this.instructorEmail = instructorEmail;
        this.instructorName = instructorName;
        this.mediaUrls = mediaUrls;
    }

    // Getters and Setters
    public String getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getInstructorEmail() { return instructorEmail; }
    public void setInstructorEmail(String instructorEmail) { this.instructorEmail = instructorEmail; }

    public String getInstructorName() { return instructorName; }
    public void setInstructorName(String instructorName) { this.instructorName = instructorName; }

    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
