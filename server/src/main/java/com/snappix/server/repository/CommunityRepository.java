// src/main/java/com/snappix/server/repository/CommunityRepository.java
package com.snappix.server.repository;

import com.snappix.server.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, String> {
    List<Community> findByCreatedBy(String createdBy);
    Optional<Community> findByNameIgnoreCase(String name);
}
