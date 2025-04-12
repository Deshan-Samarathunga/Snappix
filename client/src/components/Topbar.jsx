// src/components/Topbar.jsx
import React, { useState, useEffect } from 'react';
import logo from '../assets/logo/snappix_logo_white.png';
import LoginModal from './LoginModal';
import { getCurrentUser } from '../utils/getCurrentUser';

export default function Topbar() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("snappixUser");
    window.location.reload();
  };

  return (
    <>
      <div className="bg-dark text-light px-4 py-2 d-flex justify-content-between align-items-center border-bottom border-secondary position-fixed top-0 w-100 z-3">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Snappix Logo" height={40} className="me-3" />
        </div>

        <input type="text" placeholder="Search" className="form-control mx-4 w-50 rounded-1" />

        {user ? (
          <div className="d-flex align-items-center gap-2">
            <img
              src={user.picture}
              alt="Profile"
              className="rounded-circle"
              style={{ width: 32, height: 32 }}
            />
            <span>{user.given_name}</span>
            <button className="btn btn-outline-warning btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="btn btn-outline-light" onClick={() => setShowModal(true)}>Log In</button>
        )}
      </div>

      <LoginModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
}
