package com.snappix.server.service;

import com.snappix.server.model.Like;
import com.snappix.server.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    public boolean toggleLike(String postId, String userEmail) {
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserEmail(postId, userEmail);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return false; // unliked
        } else {
            Like like = new Like(postId, userEmail);
            likeRepository.save(like);
            return true; // liked
        }
    }

    public long countLikes(String postId) {
        return likeRepository.countByPostId(postId);
    }
}
