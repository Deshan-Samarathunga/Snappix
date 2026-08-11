// client/src/components/DeleteModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function DeleteModal({ show, onHide, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark border-secondary text-white">
        <Modal.Title>Delete post?</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <p className="text-light mb-4">Once you delete this post, it can’t be restored.</p>
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onHide}>
            Go Back
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Yes, Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
