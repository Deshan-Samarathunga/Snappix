// server/src/main/java/com/snappix/server/repository/CommentRepository.java
package com.snappix.server.repository;

import com.snappix.server.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);
}
