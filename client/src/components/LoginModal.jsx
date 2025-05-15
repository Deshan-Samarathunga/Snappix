// client/src/components/LoginModal.jsx
// This component renders the login modal including Google OAuth login
import React from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginModal({ show, onHide }) {

  // Handles successful Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential; // Get ID token from Google

    try {
      // Send the token to the backend to verify and get user info + JWT
      const res = await axios.post("http://localhost:8080/api/auth/google", {
        token: token,
      });

      // Save user and session token to localStorage for later access
      localStorage.setItem("snappixUser", JSON.stringify(res.data.user));      // used by Topbar, etc.
      localStorage.setItem("snappixSession", res.data.accessToken);  // used for auth headers

      // Close modal and reload page to reflect login state
      onHide();
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error); // show error in dev console
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="text-light">
      {/* Modal header */}
      <Modal.Header closeButton className="bg-dark border-secondary">
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>

      {/* Modal body */}
      <Modal.Body className="bg-dark">
        
        {/* Google Login Button */}
        <div className="d-grid mb-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Google Login Failed');
            }}
          />
        </div>

        {/* Divider */}
        <div className="text-center mb-2 text-muted">OR</div>

        {/* Placeholder for email/password login (currently disabled) */}
        <Form>
          <Form.Group className="mb-3">
            <Form.Control type="email" placeholder="Email or username" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button variant="primary" className="w-100" disabled>Log In</Button>
        </Form>

        {/* Links (static for now) */}
        <div className="d-flex justify-content-between mt-2 text-muted">
          <a href="/" className="text-decoration-none">Forgot password?</a>
          <a href="/" className="text-decoration-none">Sign Up</a>
        </div>
      </Modal.Body>
    </Modal>
  );
}
