// client/src/components/PostCard.jsx
// client/src/components/PostCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faCommentDots,
  faShare,
  faEllipsisV,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import './PostCard.css';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteModal from './DeleteModal';
import { Carousel } from 'react-bootstrap';

export default function PostCard({ post, location = 'home' }) {
  const [isOwner, setIsOwner] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('snappixUser'));
    if (currentUser?.email === post.userEmail) {
      setIsOwner(true);
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [post.userEmail]);

  const handleEdit = () => {
    navigate(`/edit-post/${post.id}`);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem('snappixSession');
    axios
      .delete(`http://localhost:8080/api/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => window.location.reload())
      .catch(() => alert('❌ Delete failed'));
  };

  const renderSingleMedia = (url) => {
    return url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
      <div className="media-single mb-3">
        <img className="d-block w-100 rounded" src={url} alt="media" />
      </div>
    ) : (
      <div className="media-single mb-3">
        <video controls className="d-block w-100 rounded">
          <source src={url} />
        </video>
      </div>
    );
  };

  const renderCarousel = () => {
    const isOnlyImages = post.mediaUrls.every((url) =>
      url.match(/\.(jpeg|jpg|png|gif|webp)$/i)
    );

    const showArrows = isOnlyImages && post.mediaUrls.length > 1;

    return (
      <Carousel
        interval={null}
        className="mb-3 post-carousel"
        controls={showArrows}
        indicators={showArrows}
      >
        {post.mediaUrls.map((url, index) =>
          url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 rounded"
                src={url}
                alt={`slide-${index}`}
              />
            </Carousel.Item>
          ) : (
            <Carousel.Item key={index}>
              <video controls className="d-block w-100 rounded">
                <source src={url} />
              </video>
            </Carousel.Item>
          )
        )}
      </Carousel>
    );
  };

  return (
    <div className="post-card position-relative">
      <div className="post-header d-flex justify-content-between align-items-start">
        <div>
          <div className="fw-bold text-info" style={{ fontSize: '14px' }}>
            {location === 'home'
              ? `r/${post.community}`
              : `${post.userName || post.userEmail}`}
          </div>
          <div className="text-muted fw-medium" style={{ fontSize: '12px' }}>
            {post.createdAt
              ? formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })
              : ''}
          </div>
        </div>

        {isOwner && (
          <div ref={dropdownRef}>
            <FontAwesomeIcon
              icon={faEllipsisV}
              className="text-white"
              role="button"
              onClick={() => setShowOptions((prev) => !prev)}
            />
            {showOptions && (
              <div
                className="position-absolute bg-dark border border-secondary rounded shadow-sm mt-2 text-white z-3"
                style={{ right: 0, minWidth: 120 }}
              >
                <div
                  className="px-3 py-2 hover-bg-secondary"
                  role="button"
                  onClick={handleEdit}
                >
                  <FontAwesomeIcon icon={faPen} className="me-2 text-warning" />
                  Edit
                </div>
                <div
                  className="px-3 py-2 hover-bg-secondary"
                  role="button"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="me-2 text-danger"
                  />
                  Delete
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-2">
        <h5 className="fw-semibold">
          {(post.description || '').split('\n')[0]}
        </h5>
        <p className="text-muted mb-2">
          {(post.description || '').split('\n').slice(1).join('\n') ||
            'No description.'}
        </p>
      </div>

      {/* Media rendering */}
      {post.mediaUrls?.length === 1 && renderSingleMedia(post.mediaUrls[0])}
      {post.mediaUrls?.length > 1 && renderCarousel()}

      <div className="d-flex gap-3 align-items-center">
        <span>
          <FontAwesomeIcon icon={faThumbsUp} className="me-1" /> 0
        </span>
        <span>
          <FontAwesomeIcon icon={faCommentDots} className="me-1" /> 0
        </span>
        <span>
          <FontAwesomeIcon icon={faShare} className="me-1" /> Share
        </span>
      </div>

      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
