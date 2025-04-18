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

    // ✅ Get all communities
    @GetMapping
    public ResponseEntity<List<Community>> getAll() {
        return ResponseEntity.ok(communityRepo.findAll());
    }

    // ✅ Get communities created by the currently authenticated user
    @GetMapping("/my")
    public List<Community> getMyCommunities(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return communityRepo.findByCreatedBy(email);
    }

    // ✅ Get a community by name
    @GetMapping("/name/{name}")
    public ResponseEntity<Object> getCommunityByName(@PathVariable String name) {
        Optional<Community> found = communityRepo.findByNameIgnoreCase(name);
        return found.<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Community not found"));
    }

    // ✅ Create a new community with optional icon/banner and topic list
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
            community.setName(name.trim());
            community.setDescription(description);
            community.setCreatedBy(email);
            community.setIconUrl(iconUrl);
            community.setBannerUrl(bannerUrl);
            community.setTopicsFromJson(topicsJson);

            Community saved = communityRepo.save(community);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ✅ Join an existing community (except if already the creator)
    @PostMapping("/join/{name}")
    public ResponseEntity<?> joinCommunity(@RequestHeader("Authorization") String authHeader,
            @PathVariable String name) {
        String token = authHeader.replace("Bearer ", "");
        String userEmail = jwtUtil.extractEmail(token);

        Optional<Community> found = communityRepo.findByNameIgnoreCase(name);
        if (found.isEmpty()) {
            return ResponseEntity.status(404).body("Community not found");
        }

        Community community = found.get();

        if (community.getCreatedBy().equalsIgnoreCase(userEmail)) {
            return ResponseEntity.badRequest().body("You are the moderator of this community");
        }

        if (!community.getMembers().contains(userEmail)) {
            community.getMembers().add(userEmail);
            communityRepo.save(community);
        }

        return ResponseEntity.ok("Joined successfully");
    }

    // ✅ Leave a community (except if moderator)
    @PostMapping("/leave/{name}")
    public ResponseEntity<?> leaveCommunity(@RequestHeader("Authorization") String authHeader,
            @PathVariable String name) {
        String token = authHeader.replace("Bearer ", "");
        String userEmail = jwtUtil.extractEmail(token);

        Optional<Community> found = communityRepo.findByNameIgnoreCase(name);
        if (found.isEmpty()) {
            return ResponseEntity.status(404).body("Community not found");
        }

        Community community = found.get();

        if (community.getCreatedBy().equalsIgnoreCase(userEmail)) {
            return ResponseEntity.badRequest().body("Moderators cannot leave their own community");
        }

        if (community.getMembers().remove(userEmail)) {
            communityRepo.save(community);
            return ResponseEntity.ok("Left successfully");
        }

        return ResponseEntity.badRequest().body("You are not a member of this community");
    }

    // ✅ Return all communities the user has joined or created
    @GetMapping("/joined")
    public ResponseEntity<?> getJoinedCommunities(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        List<Community> all = communityRepo.findAll();

        // Filter where user is either creator or member
        List<Community> joined = all.stream()
                .filter(c -> c.getCreatedBy().equalsIgnoreCase(email)
                        || (c.getMembers() != null && c.getMembers().contains(email)))
                .toList();

        return ResponseEntity.ok(joined);
    }

}
