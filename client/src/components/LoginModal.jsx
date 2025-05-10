// client/src/components/LoginModal.jsx
import React from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ show, onHide }) {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const res = await axios.post("http://localhost:8080/api/auth/google", {
        token,
      });

      const { user, accessToken } = res.data;
      localStorage.setItem("snappixUser", JSON.stringify(user));
      localStorage.setItem("snappixSession", accessToken);

      toast.success("✅ Logged in successfully");
      onHide();
      setTimeout(() => navigate("/profile"), 500);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("❌ Google login failed. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="text-light">
      <Modal.Header closeButton className="bg-dark border-secondary">
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark">
        <div className="d-grid mb-3 text-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("❌ Google login failed")}
            useOneTap
          />
        </div>

        <div className="text-center text-muted my-3">or log in manually (disabled)</div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Control type="email" placeholder="Email or username" disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="password" placeholder="Password" disabled />
          </Form.Group>
          <Button variant="primary" className="w-100" disabled>
            Log In
          </Button>
        </Form>

        <div className="d-flex justify-content-between mt-3 text-muted">
          <a href="/" className="text-decoration-none">Forgot password?</a>
          <a href="/" className="text-decoration-none">Sign Up</a>
        </div>
      </Modal.Body>
    </Modal>
  );
}
