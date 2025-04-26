package com.snappix.server.service;

import com.snappix.server.model.Comment;
import com.snappix.server.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment addComment(String postId, String userEmail, String content) {
        Comment comment = new Comment(postId, userEmail, content);
        return commentRepository.save(comment);
    }

    public List<Comment> getComments(String postId) {
        return commentRepository.findByPostId(postId);
    }
}
