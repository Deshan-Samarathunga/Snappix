// server/src/main/java/com/snappix/server/repository/CommentRepository.java
package com.snappix.server.repository;

import com.snappix.server.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);
}
