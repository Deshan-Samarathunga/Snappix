// src/main/java/com/snappix/server/repository/CommunityRepository.java
package com.snappix.server.repository;

import com.snappix.server.model.Community;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends MongoRepository<Community, String> {
    List<Community> findByCreatedBy(String createdBy);
    Optional<Community> findByNameIgnoreCase(String name);
}
