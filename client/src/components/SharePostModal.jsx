// client/src/components/SharePostModal.jsx
// client/src/components/SharePostModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SharePostModal({ show, onHide, originalPost }) {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const token = localStorage.getItem('snappixSession');

  useEffect(() => {
    if (show && token) {
      axios.get('http://localhost:8080/api/communities/joined', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setCommunities(res.data))
        .catch(() => toast.error('Failed to fetch communities'));
    }
  }, [show, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/posts/crosspost', {
        originalPostId: originalPost.id,
        title: (originalPost.description || '').split('\n')[0],
        community: selectedCommunity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Post shared successfully!');
      onHide();
    } catch (err) {
      toast.error('Failed to share post');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Share Post to Community</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Choose community</Form.Label>
            <Form.Select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {communities.map((c) => (
                <option key={c.id} value={c.name}>c/{c.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Original Title</Form.Label>
            <Form.Control
              value={(originalPost.description || '').split('\n')[0]}
              readOnly
              disabled
            />
          </Form.Group>

          <Button type="submit" className="mt-3 w-100" variant="warning">
            Share
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
