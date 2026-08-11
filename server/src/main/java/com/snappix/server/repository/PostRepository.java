// src/main/java/com/snappix/server/repository/PostRepository.java
package com.snappix.server.repository;

import com.snappix.server.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {
    List<Post> findByUserEmail(String email);
    List<Post> findByCommunityIgnoreCase(String community);
    List<Post> findByOriginalPostIdAndUserEmail(String originalPostId, String email);

}