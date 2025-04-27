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
public class CommentController {

    @Autowired
    private CommentRepository commentRepo;

    // Create a new comment
    @PostMapping("/create")
    public ResponseEntity<?> createComment(@RequestBody Comment comment) {
        // You can add further validation, for example, checking if the user is logged in.
        Comment savedComment = commentRepo.save(comment);
        return ResponseEntity.ok(savedComment);
    }

    // Get all comments for a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentsByPost(@PathVariable String postId) {
        List<Comment> comments = commentRepo.findByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        Optional<Comment> comment = commentRepo.findById(id);
        if (comment.isPresent()) {
            commentRepo.deleteById(id);
            return ResponseEntity.ok("Comment deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Comment not found");
        }
    }
}
