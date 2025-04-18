// src/main/java/com/snappix/server/repository/PostRepository.java
package com.snappix.server.repository;

import com.snappix.server.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserEmail(String email);
    List<Post> findByCommunity(String community);
    List<Post> findByCommunityIgnoreCase(String community);
}
