package com.snappix.server.controller;

import com.snappix.server.model.Comment;
import com.snappix.server.service.CommentService;
import com.snappix.server.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LikeCommentController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private CommentService commentService;

    @PostMapping("/posts/{postId}/like")
    public Map<String, Object> toggleLike(@PathVariable String postId, @RequestParam String userEmail) {
        boolean liked = likeService.toggleLike(postId, userEmail);
        long likeCount = likeService.countLikes(postId);

        return Map.of(
                "liked", liked,
                "likeCount", likeCount
        );
    }

    @PostMapping("/posts/{postId}/comment")
    public Comment addComment(@PathVariable String postId,
                               @RequestParam String userEmail,
                               @RequestParam String content) {
        return commentService.addComment(postId, userEmail, content);
    }

    @GetMapping("/posts/{postId}/comments")
    public List<Comment> getComments(@PathVariable String postId) {
        return commentService.getComments(postId);
    }
}
