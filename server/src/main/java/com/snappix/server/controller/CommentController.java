package com.snappix.server.controller;

import com.snappix.server.model.Comment;
import com.snappix.server.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepo;

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Comment comment) {
        comment.setCreatedAt(new Date());
        return ResponseEntity.ok(commentRepo.save(comment));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentsForPost(@PathVariable String postId) {
        return ResponseEntity.ok(commentRepo.findByPostIdOrderByCreatedAtAsc(postId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Comment> c = commentRepo.findById(id);
        if (c.isEmpty()) return ResponseEntity.status(404).body("Comment not found");

        Comment comment = c.get();
        comment.setContent(body.get("content"));
        comment.setEdited(true);
        comment.setUpdatedAt(new Date());
        return ResponseEntity.ok(commentRepo.save(comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        commentRepo.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

    @PutMapping("/like/{id}")
    public ResponseEntity<?> likeComment(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Comment> c = commentRepo.findById(id);
        if (c.isEmpty()) return ResponseEntity.status(404).body("Comment not found");
        Comment comment = c.get();
        String userId = body.get("userId");

        comment.getDislikes().remove(userId);
        if (comment.getLikes().contains(userId)) {
            comment.getLikes().remove(userId);
        } else {
            comment.getLikes().add(userId);
        }

        return ResponseEntity.ok(commentRepo.save(comment));
    }

    @PutMapping("/dislike/{id}")
    public ResponseEntity<?> dislikeComment(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Comment> c = commentRepo.findById(id);
        if (c.isEmpty()) return ResponseEntity.status(404).body("Comment not found");
        Comment comment = c.get();
        String userId = body.get("userId");

        comment.getLikes().remove(userId);
        if (comment.getDislikes().contains(userId)) {
            comment.getDislikes().remove(userId);
        } else {
            comment.getDislikes().add(userId);
        }

        return ResponseEntity.ok(commentRepo.save(comment));
    }
}
