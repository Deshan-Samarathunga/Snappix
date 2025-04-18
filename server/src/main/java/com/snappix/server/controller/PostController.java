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

    // Create a new post with optional media
    @PostMapping("/create")
    public ResponseEntity<?> createPost(
        @RequestParam("description") String description,
        @RequestParam("community") String community,
        @RequestPart(value = "media", required = false) List<MultipartFile> mediaFiles
    ) {
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

        Post post = new Post(email, community, description, mediaUrls);
        Post saved = postRepo.save(post);

        return ResponseEntity.ok(saved);
    }

    // Get all posts created by authenticated user
    @GetMapping
    public ResponseEntity<?> getUserPosts() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Post> posts = postRepo.findByUserEmail(email);
        return ResponseEntity.ok(posts);
    }

    // 🔍 Get all posts by community name
    @GetMapping("/community/{name}")
    public ResponseEntity<?> getPostsByCommunity(@PathVariable String name) {
        List<Post> posts = postRepo.findByCommunityIgnoreCase(name); // use new method
        return ResponseEntity.ok(posts);
    }
    
}
