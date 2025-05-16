import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentDots, faShare, faEllipsisV, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import './PostCard.css';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteModal from './DeleteModal';

export default function PostCard({ post, moderators = [], currentUserEmail, communityName }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isOwner = currentUserEmail === post.userEmail;
  const isModerator = moderators.includes(currentUserEmail);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    navigate(`/edit-post/${post.id}`);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem("snappixSession");
    if (isModerator && !isOwner) {
      // Moderator deletes any post
      axios
        .delete(`http://localhost:8080/api/communities/${communityName}/delete-post/${post.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => window.location.reload())
        .catch(() => alert("❌ Delete failed"));
    } else {
      // Owner deletes own post
      axios
        .delete(`http://localhost:8080/api/posts/${post.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => window.location.reload())
        .catch(() => alert("❌ Delete failed"));
    }
  };

  return (
    <div className="post-card position-relative">
      <div className="post-header d-flex justify-content-between align-items-start">
        <div>
          <div className="fw-bold text-info" style={{ fontSize: '14px' }}>
            {`r/${post.community}`}
          </div>
          <div className="text-muted fw-medium" style={{ fontSize: '12px' }}>
            {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ''}
          </div>
        </div>

        {(isOwner || isModerator) && (
          <div ref={dropdownRef}>
            <FontAwesomeIcon
              icon={faEllipsisV}
              className="text-white"
              role="button"
              onClick={() => setShowOptions(prev => !prev)}
            />
            {showOptions && (
              <div
                className="position-absolute bg-dark border border-secondary rounded shadow-sm mt-2 text-white z-3"
                style={{ right: 0, minWidth: 120 }}
              >
                {isOwner && (
                  <div className="px-3 py-2 hover-bg-secondary" role="button" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPen} className="me-2 text-warning" />
                    Edit
                  </div>
                )}
                <div className="px-3 py-2 hover-bg-secondary" role="button" onClick={() => setShowDeleteModal(true)}>
                  <FontAwesomeIcon icon={faTrash} className="me-2 text-danger" />
                  Delete
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      {post.title && <h5 className="fw-semibold">{post.title}</h5>}

      {/* Body with paragraph support */}
      <div className="post-body mb-2">
        {(post.description || "No description.")
          .split('\n')
          .filter(line => line.trim() !== "")
          .map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
      </div>

      {/* Media */}
      {post.mediaUrls?.length > 0 && (
        <div className="media-container">
          {post.mediaUrls[0].match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <img src={post.mediaUrls[0]} alt="media" />
          ) : (
            <video controls>
              <source src={post.mediaUrls[0]} />
            </video>
          )}
        </div>
      )}

      <div className="d-flex gap-3 align-items-center">
        <span><FontAwesomeIcon icon={faThumbsUp} className="me-1" /> 0</span>
        <span><FontAwesomeIcon icon={faCommentDots} className="me-1" /> 0</span>
        <span><FontAwesomeIcon icon={faShare} className="me-1" /> Share</span>
      </div>

      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
