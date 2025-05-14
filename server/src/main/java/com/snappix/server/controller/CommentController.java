
package com.snappix.server.controller;

import com.snappix.server.model.Comment;
import com.snappix.server.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000") // 🔥 Allow React frontend on port 3000
public class CommentController {

    @Autowired
    private CommentRepository commentRepo;

    // Create a new comment
    @PostMapping("/create")
    public ResponseEntity<?> createComment(@RequestBody Comment comment) {
        try {
            Comment savedComment = commentRepo.save(comment);
            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating comment: " + e.getMessage());
        }
    }

    // Get all comments for a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentsByPost(@PathVariable String postId) {
        try {
            List<Comment> comments = commentRepo.findByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching comments: " + e.getMessage());
        }
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        try {
            Optional<Comment> comment = commentRepo.findById(id);
            if (comment.isPresent()) {
                commentRepo.deleteById(id);
                return ResponseEntity.ok("Comment deleted successfully");
            } else {
                return ResponseEntity.status(404).body("Comment not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting comment: " + e.getMessage());
        }
    }
}



