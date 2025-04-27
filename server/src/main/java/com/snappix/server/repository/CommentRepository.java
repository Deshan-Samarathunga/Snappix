package com.snappix.server.repository;

import com.snappix.server.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {

    // Get all comments by post ID
    List<Comment> findByPostId(String postId);

    // Optional: Get comments by user email (if needed)
    List<Comment> findByUserEmail(String userEmail);
}
