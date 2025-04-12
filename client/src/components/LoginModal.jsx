// client/src/components/LoginModal.jsx
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function LoginModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered className="text-light">
      <Modal.Header closeButton className="bg-dark border-secondary">
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark">

        <div className="d-grid mb-3">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log("Google token:", credentialResponse.credential);
              // You can send this token to your Spring Boot backend here
            }}
            onError={() => {
              console.log('Google Login Failed');
            }}
          />
        </div>

        <div className="text-center mb-2 text-muted">OR</div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Control type="email" placeholder="Email or username" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button variant="primary" className="w-100" disabled>Log In</Button>
        </Form>

        <div className="d-flex justify-content-between mt-2 text-muted">
          <a href="/" className="text-decoration-none">Forgot password?</a>
          <a href="/" className="text-decoration-none">Sign Up</a>
        </div>
      </Modal.Body>
    </Modal>
  );
}
