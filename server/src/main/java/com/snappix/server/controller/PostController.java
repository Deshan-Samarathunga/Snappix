// src/main/java/com/snappix/server/controller/PostController.java
package com.snappix.server.controller;

import com.snappix.server.model.Post;
import com.snappix.server.repository.PostRepository;
import com.snappix.server.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepo;

    @Autowired
    private S3Service s3Service;

    @PostMapping("/create")
    public ResponseEntity<?> createPost(
            @RequestParam("userName") String userName,
            @RequestParam("description") String description,
            @RequestParam("community") String community,
            @RequestPart(value = "media", required = false) List<MultipartFile> mediaFiles) {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<String> mediaUrls = new ArrayList<>();
        try {
            if (mediaFiles != null) {
                for (MultipartFile file : mediaFiles) {
                    String url = s3Service.uploadFile(file);
                    mediaUrls.add(url);
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Media upload failed: " + e.getMessage());
        }

        Post post = new Post(email, userName, community.trim().toLowerCase(), description, mediaUrls);
        Post saved = postRepo.save(post);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok(postRepo.findAll());
    }

    @GetMapping("/community/{name}")
    public ResponseEntity<?> getPostsByCommunity(@PathVariable String name) {
        return ResponseEntity.ok(postRepo.findByCommunityIgnoreCase(name));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        Optional<Post> optionalPost = postRepo.findById(id);

        if (optionalPost.isEmpty()) {
            return ResponseEntity.status(404).body("Post not found");
        }

        Post post = optionalPost.get();

        try {
            // Delete media files from S3
            if (post.getMediaUrls() != null) {
                for (String url : post.getMediaUrls()) {
                    s3Service.deleteFileByUrl(url);
                }
            }

            // Delete the post document
            postRepo.deleteById(id);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete post");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        Optional<Post> post = postRepo.findById(id);
        if (post.isPresent()) {
            return ResponseEntity.ok(post.get());
        } else {
            return ResponseEntity.status(404).body("Post not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Post> optionalPost = postRepo.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.status(404).body("Post not found");
        }

        Post post = optionalPost.get();
        post.setDescription(body.get("description"));
        postRepo.save(post);
        return ResponseEntity.ok("Post updated successfully");
    }

}
