// client/src/components/CommentSection.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';

export default function CommentSection({ postId, postAuthor }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const user = JSON.parse(localStorage.getItem('snappixUser'));
  const token = localStorage.getItem('snappixSession');

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/comments/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      const normalized = res.data.map((c) => ({
        ...c,
        id: c.id || c._id,
      }));
      setComments(normalized);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  }, [postId, token]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await axios.post(
        'http://localhost:8080/api/comments',
        {
          postId,
          userId: user.email,
          userName: user.name,
          content: commentText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentText('');
      fetchComments();
    } catch (err) {
      console.error('Comment submit failed', err);
    }
  };

  const handleVote = async (id, type) => {
    try {
      await axios.put(
        `http://localhost:8080/api/comments/${type}/${id}`,
        { userId: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch (err) {
      console.error(`Failed to ${type}`, err);
    }
  };

  const handleEdit = async (comment) => {
    const newContent = prompt('Edit your comment:', comment.content);
    if (!newContent || newContent.trim() === '') return;

    try {
      await axios.put(
        `http://localhost:8080/api/comments/${comment.id}`,
        { content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch (err) {
      console.error('Failed to edit comment', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return (
    <div className="mt-4">
      <h5>Comments</h5>
      {user ? (
        <Form onSubmit={handleSubmit} className="mb-3">
          <InputGroup>
            <Form.Control
              as="textarea"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What are your thoughts?"
              rows={3}
            />
          </InputGroup>
          <Button type="submit" variant="warning" className="mt-2">
            Comment
          </Button>
        </Form>
      ) : (
        <p className="text-muted">Log in to leave a comment.</p>
      )}

      {comments.length === 0 && <p className="text-muted">No comments yet.</p>}

      {comments.map((comment) => (
        <div key={comment.id} className="border rounded p-3 mb-2 bg-dark text-light">
          <div className="d-flex justify-content-between">
            <strong>{comment.userName}</strong>
            <span className="text-muted" style={{ fontSize: '12px' }}>
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              {comment.edited && <Badge bg="secondary" className="ms-2">Edited</Badge>}
            </span>
          </div>
          <p className="mb-1 mt-2">{comment.content}</p>

          <div className="d-flex gap-3 text-muted" style={{ fontSize: '14px' }}>
            <span role="button" onClick={() => handleVote(comment.id, 'like')}>
              👍 {comment.likes?.length || 0}
            </span>
            <span role="button" onClick={() => handleVote(comment.id, 'dislike')}>
              👎 {comment.dislikes?.length || 0}
            </span>
          </div>

          {user?.email === comment.userId && (
            <div className="d-flex gap-2 mt-2">
              <Button variant="outline-light" size="sm" onClick={() => handleEdit(comment)}>
                Edit
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(comment.id)}>
                Delete
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
