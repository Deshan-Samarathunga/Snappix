// src/main/java/com/snappix/server/controller/CommunityController.java
package com.snappix.server.controller;

import com.snappix.server.model.Community;
import com.snappix.server.repository.CommunityRepository;
import com.snappix.server.service.S3Service;
import com.snappix.server.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    @Autowired
    private CommunityRepository communityRepo;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * ✅ Get all communities
     */
    @GetMapping
    public ResponseEntity<List<Community>> getAll() {
        return ResponseEntity.ok(communityRepo.findAll());
    }

    /**
     * ✅ Get communities created by the currently authenticated user
     */
    @GetMapping("/my")
    public List<Community> getMyCommunities(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return communityRepo.findByCreatedBy(email);
    }

    /**
     * ✅ Get a community by name (for frontend display at /c/:name)
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<Object> getCommunityByName(@PathVariable String name) {
        Optional<Community> found = communityRepo.findByNameIgnoreCase(name);
        return found.<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Community not found"));
    }
    
    

    /**
     * ✅ Create a new community with optional banner/icon and selected topics
     */
    @PostMapping
    public ResponseEntity<?> createCommunity(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("topics") String topicsJson,
            @RequestPart(value = "icon", required = false) MultipartFile iconFile,
            @RequestPart(value = "banner", required = false) MultipartFile bannerFile) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token);

            String iconUrl = null;
            String bannerUrl = null;

            if (iconFile != null && !iconFile.isEmpty()) {
                iconUrl = s3Service.uploadFile(iconFile);
            }
            if (bannerFile != null && !bannerFile.isEmpty()) {
                bannerUrl = s3Service.uploadFile(bannerFile);
            }

            Community community = new Community();
            community.setName(name);
            community.setDescription(description);
            community.setCreatedBy(email);
            community.setIconUrl(iconUrl);
            community.setBannerUrl(bannerUrl);
            community.setTopicsFromJson(topicsJson);

            Community saved = communityRepo.save(community);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace(); // ✅ log actual issue in backend terminal
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
