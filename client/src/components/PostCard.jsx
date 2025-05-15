
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentDots, faShare, faEllipsisV, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import './PostCard.css';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';  // Import the DeleteModal component

export default function PostCard({ post, location = "home" }) {
  const [isOwner, setIsOwner] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]); // Store comments state

 useEffect(() => {
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/comments/post/${post.id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  fetchComments();

  const savedLiked = JSON.parse(localStorage.getItem(`liked_${post.id}`)) || false;
  setLiked(savedLiked);
}, [post.id]);


  const handleLike = () => {
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
    localStorage.setItem(`liked_${post.id}`, JSON.stringify(newLikedStatus));
  };

  const handleCommentToggle = () => {
    setShowCommentBox(prev => !prev);
  };

 const handleCommentSubmit = async () => {
  if (commentText.trim()) {
    const newComment = {
      postId: post.id,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:8080/api/comments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments([...comments, savedComment]);
        setCommentText('');
      } else {
        console.error('Failed to create comment');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  }
};


  const handleDeleteComment = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/comments/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setComments(comments.filter(comment => comment.id !== id));
    } else {
      console.error('Failed to delete comment');
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};


  const handleEditComment = (id) => {
    const updatedComments = comments.map(comment =>
      comment.id === id ? { ...comment, isEditing: true } : comment
    );
    setComments(updatedComments);
  };

  const handleSaveEdit = (id, newText) => {
    const updatedComments = comments.map(comment =>
      comment.id === id ? { ...comment, text: newText, isEditing: false } : comment
    );
    setComments(updatedComments);
    localStorage.setItem(`comments_${post.id}`, JSON.stringify(updatedComments));
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("snappixUser"));
    if (currentUser?.email === post.userEmail) {
      setIsOwner(true);
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [post.userEmail]);

  const handleEdit = () => {
    navigate(`/edit-post/${post.id}`);
  };

  const confirmDelete = () => {
  window.location.reload();
};


  return (
    <div className="post-card position-relative">
      <div className="post-header d-flex justify-content-between align-items-start">
        <div>
          <div className="fw-bold text-info" style={{ fontSize: '14px' }}>
            {location === "home" ? `r/${post.community}` : `${post.userName || post.userEmail}`}
          </div>
          <div className="text-muted fw-medium" style={{ fontSize: '12px' }}>
            {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ''}
          </div>
        </div>

        {isOwner && (
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
                <div className="px-3 py-2 hover-bg-secondary" role="button" onClick={handleEdit}>
                  <FontAwesomeIcon icon={faPen} className="me-2 text-warning" />
                  Edit
                </div>
                <div className="px-3 py-2 hover-bg-secondary" role="button" onClick={() => setShowDeleteModal(true)}>
                  <FontAwesomeIcon icon={faTrash} className="me-2 text-danger" />
                  Delete
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-2">
        <h5 className="fw-semibold">{(post.description || "").split('\n')[0]}</h5>
        <p className="text-muted mb-2">
          {(post.description || "").split('\n').slice(1).join('\n') || "No description."}
        </p>
      </div>

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

      {/* Like, Comment, Share */}
      <div className="d-flex flex-column gap-2">
        <div className="d-flex gap-3 align-items-center">
          <span role="button" onClick={handleLike}>
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={`me-1 ${liked ? "text-primary" : "text-white"}`}
            />
            {liked ? 1 : 0}
          </span>

          <span role="button" onClick={handleCommentToggle}>
            <FontAwesomeIcon icon={faCommentDots} className="me-1 text-white" />
            Comment
          </span>

          <span role="button">
            <FontAwesomeIcon icon={faShare} className="me-1 text-white" />
            Share
          </span>
        </div>

        {showCommentBox && (
          <div className="mt-2">
            <textarea
              className="form-control bg-dark text-white"
              rows="2"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className="btn btn-sm btn-info mt-2"
              onClick={handleCommentSubmit}
            >
              Post Comment
            </button>
          </div>
        )}

        {/* List of Comments */}
        {comments.length > 0 && (
          <div className="comments-list mt-3">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-secondary text-white p-2 rounded mb-2 d-flex justify-content-between align-items-start">
                <div>
                  <div style={{ fontSize: '12px' }} className="text-muted">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </div>
                  {comment.isEditing ? (
                    <div>
                      <textarea
                        className="form-control bg-dark text-white"
                        rows="2"
                        value={comment.text}
                        onChange={(e) => {
                          const updatedComments = comments.map((com) =>
                            com.id === comment.id ? { ...com, text: e.target.value } : com
                          );
                          setComments(updatedComments);
                        }}
                      />
                      <button
                        className="btn btn-sm btn-success mt-2"
                        onClick={() => handleSaveEdit(comment.id, comment.text)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>{comment.text}</div>
                  )}
                </div>
                <div>
                  {!comment.isEditing && (
                    <button
                      className="btn btn-sm btn-warning ms-2"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-danger ms-2"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          confirmDelete={confirmDelete}
        />
      )}
    </div>
  );
}

