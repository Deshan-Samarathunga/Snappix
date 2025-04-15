// src/components/PostCard.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentDots, faShare } from '@fortawesome/free-solid-svg-icons';

export default function PostCard({ post }) {
  return (
    <div className="card bg-dark text-light border-secondary rounded-3 shadow-sm mb-3">
      <div className="card-body">
        <h6 className="text-info mb-1">{post.userEmail}</h6>
        <p>{post.description}</p>
        {post.mediaUrls && post.mediaUrls.map((url, i) => (
          <div key={i} className="mb-2">
            {url.match(/\.(jpeg|jpg|png|gif)$/) ? (
              <img src={url} alt="media" className="img-fluid rounded" />
            ) : (
              <video controls className="w-100 rounded">
                <source src={url} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
        <div className="d-flex gap-4 mt-3">
          <span><FontAwesomeIcon icon={faThumbsUp} className="me-2" />0</span>
          <span><FontAwesomeIcon icon={faCommentDots} className="me-2" />0</span>
          <span><FontAwesomeIcon icon={faShare} className="me-2" />Share</span>
        </div>
      </div>
    </div>
  );
}
