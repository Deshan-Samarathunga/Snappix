package com.snappix.server.controller;

import com.snappix.server.model.Community;
import com.snappix.server.repository.CommunityRepository;
import com.snappix.server.service.OnlineUserTracker;
import com.snappix.server.service.S3Service;
import com.snappix.server.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    @Autowired
    private CommunityRepository communityRepo;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OnlineUserTracker onlineTracker;

    // Get all communities
    @GetMapping
    public ResponseEntity<List<Community>> getAll() {
        return ResponseEntity.ok(communityRepo.findAll());
    }

    // Get communities created by the currently authenticated user
    @GetMapping("/my")
    public List<Community> getMyCommunities(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return communityRepo.findByCreatedBy(email);
    }

    // Get a community by name (with online count)
    @GetMapping("/name/{name}")
    public ResponseEntity<?> getCommunityByName(@PathVariable String name) {
        Optional<Community> found = communityRepo.findByNameIgnoreCase(name);
        if (found.isPresent()) {
            Community community = found.get();
            Map<String, Object> response = new HashMap<>();
            response.put("community", community);
            response.put("onlineCount", onlineTracker.getOnlineCount(name));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(404).body("Community not found");
    }

    // Get a community by id (with online count)
    @GetMapping("/{id}")
    public ResponseEntity<?> getCommunityById(@PathVariable String id) {
        Optional<Community> found = communityRepo.findById(id);
        if (found.isPresent()) {
            Community community = found.get();
            Map<String, Object> response = new HashMap<>();
            response.put("community", community);
            response.put("onlineCount", onlineTracker.getOnlineCount(community.getName()));
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(404).body("Community not found");
        }
    }

    // Create a new community
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

            if (communityRepo.findByNameIgnoreCase(name.trim()).isPresent()) {
                return ResponseEntity.badRequest().body("Community name already exists");
            }

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

            // Add the creator as the first moderator
            List<String> initialModerators = new ArrayList<>();
            initialModerators.add(email);
            community.setModerators(initialModerators);

            // Set the creation date
            community.setCreatedAt(new Date());

            Community saved = communityRepo.save(community);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Update/Edit a community (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCommunity(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("topics") String topicsJson,
            @RequestPart(value = "icon", required = false) MultipartFile iconFile,
            @RequestPart(value = "banner", required = false) MultipartFile bannerFile) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token);

            Optional<Community> found = communityRepo.findById(id);
            if (found.isEmpty()) {
                return ResponseEntity.status(404).body("Community not found");
            }
            Community community = found.get();

            // Only the creator can edit
            if (!community.getCreatedBy().equalsIgnoreCase(email)) {
                return ResponseEntity.status(403).body("Only the creator can edit this community");
            }

            community.setName(name.trim());
            community.setDescription(description);
            community.setTopicsFromJson(topicsJson);

            // Handle icon/banner update (optional)
            if (iconFile != null && !iconFile.isEmpty()) {
                String iconUrl = s3Service.uploadFile(iconFile);
                community.setIconUrl(iconUrl);
            }
            if (bannerFile != null && !bannerFile.isEmpty()) {
                String bannerUrl = s3Service.uploadFile(bannerFile);
                community.setBannerUrl(bannerUrl);
            }

            Community updated = communityRepo.save(community);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Delete a community (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommunity(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        Optional<Community> found = communityRepo.findById(id);
        if (found.isEmpty()) {
            return ResponseEntity.status(404).body("Community not found");
        }
        Community community = found.get();

        // Only the creator can delete
        if (!community.getCreatedBy().equalsIgnoreCase(email)) {
            return ResponseEntity.status(403).body("Only the creator can delete this community");
        }

        communityRepo.deleteById(id);
        return ResponseEntity.ok("Community deleted successfully");
    }

    // Join an existing community (except if already the creator)
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
            onlineTracker.userJoined(name, userEmail);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("community", community);
        response.put("onlineCount", onlineTracker.getOnlineCount(name));
        return ResponseEntity.ok(response);
    }

    // Leave a community (except if moderator)
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
            onlineTracker.userLeft(name, userEmail);

            Map<String, Object> response = new HashMap<>();
            response.put("community", community);
            response.put("onlineCount", onlineTracker.getOnlineCount(name));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body("You are not a member of this community");
    }

    // Promote a member to moderator (Only moderators can do this)
    @PostMapping("/promote/{name}/{memberEmail}")
    public ResponseEntity<?> promoteMember(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String name,
            @PathVariable String memberEmail) {

        String token = authHeader.replace("Bearer ", "");
        String requestingUserEmail = jwtUtil.extractEmail(token);

        Optional<Community> found = communityRepo.findByNameIgnoreCase(name);
        if (found.isEmpty()) {
            return ResponseEntity.status(404).body("Community not found");
        }

        Community community = found.get();

        // Only moderators can promote
        if (!community.getModerators().contains(requestingUserEmail)) {
            return ResponseEntity.status(403).body("Only moderators can promote members");
        }

        // Must be a member, and not already a moderator
        if (!community.getMembers().contains(memberEmail)) {
            return ResponseEntity.badRequest().body("User is not a member");
        }
        if (community.getModerators().contains(memberEmail)) {
            return ResponseEntity.badRequest().body("User is already a moderator");
        }

        community.getModerators().add(memberEmail);
        communityRepo.save(community);

        return ResponseEntity.ok(community);
    }

    // Return all communities the user has joined or created
    @GetMapping("/joined")
    public ResponseEntity<?> getJoinedCommunities(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        List<Community> all = communityRepo.findAll();

        List<Community> joined = all.stream()
                .filter(c -> c.getCreatedBy().equalsIgnoreCase(email)
                        || (c.getMembers() != null && c.getMembers().contains(email)))
                .toList();

        return ResponseEntity.ok(joined);
    }

    // Presence endpoints
    @PostMapping("/presence/{name}/join")
    public ResponseEntity<?> trackUserJoined(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String name) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        Optional<Community> found = communityRepo.findByNameIgnoreCase(name);
        if (found.isEmpty()) {
            return ResponseEntity.status(404).body("Community not found");
        }

        onlineTracker.userJoined(name, email);
        return ResponseEntity.ok(onlineTracker.getOnlineCount(name));
    }

    @PostMapping("/presence/{name}/leave")
    public ResponseEntity<?> trackUserLeft(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String name) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        Optional<Community> found = communityRepo.findByNameIgnoreCase(name);
        if (found.isEmpty()) {
            return ResponseEntity.status(404).body("Community not found");
        }

        onlineTracker.userLeft(name, email);
        return ResponseEntity.ok(onlineTracker.getOnlineCount(name));
    }

    @GetMapping("/presence/{name}")
    public ResponseEntity<?> getOnlineCount(@PathVariable String name) {
        Optional<Community> found = communityRepo.findByNameIgnoreCase(name);
        if (found.isEmpty()) {
            return ResponseEntity.status(404).body("Community not found");
        }
        return ResponseEntity.ok(onlineTracker.getOnlineCount(name));
    }

    @GetMapping("/presence/{name}/users")
    public ResponseEntity<?> getOnlineUsers(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String name) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        Optional<Community> found = communityRepo.findByNameIgnoreCase(name);
        if (found.isEmpty()) {
            return ResponseEntity.status(404).body("Community not found");
        }

        Community community = found.get();

        if (!community.getModerators().contains(email)) {
            return ResponseEntity.status(403).body("Only moderators can see online users");
        }

        Set<String> onlineUsers = onlineTracker.getOnlineUsers(name);
        Map<String, Object> response = new HashMap<>();
        response.put("onlineUsers", onlineUsers);
        response.put("onlineCount", onlineUsers.size());
        return ResponseEntity.ok(response);
    }
}
