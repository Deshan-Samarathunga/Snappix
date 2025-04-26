package com.snappix.server.repository;

import com.snappix.server.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {
    Optional<Like> findByPostIdAndUserEmail(String postId, String userEmail);
    long countByPostId(String postId);
}
