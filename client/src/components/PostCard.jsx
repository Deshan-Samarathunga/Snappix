// src/components/PostCard.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentDots, faShare } from '@fortawesome/free-solid-svg-icons';

export default function PostCard({ post }) {
  return (
    <div className="card bg-dark text-light border-secondary mb-4 rounded-3">
      <div className="card-body">
        <h6 className="text-info">{post.author} <small className="text-muted">{post.time}</small></h6>
        <p>{post.text}</p>
        {post.image && <img src={post.image} alt="post" className="img-fluid rounded" />}
        <div className="d-flex gap-4 mt-3">
          <span className="text-light">
            <FontAwesomeIcon icon={faThumbsUp} className="me-2" />
            {post.likes}
          </span>
          <span className="text-light">
            <FontAwesomeIcon icon={faCommentDots} className="me-2" />
            {post.comments}
          </span>
          <span className="text-light">
            <FontAwesomeIcon icon={faShare} className="me-2" />
            Share
          </span>
        </div>
      </div>
    </div>
  );
}