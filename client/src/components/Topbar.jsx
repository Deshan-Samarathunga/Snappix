// src/components/Topbar.jsx

// 🔼 Topbar component: displays site logo, search bar, create post button, and user profile dropdown

import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo/snappix_logo_white.png';
import LoginModal from './LoginModal';
import { getCurrentUser } from '../utils/getCurrentUser';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

export default function Topbar() {
  const [showModal, setShowModal] = useState(false);            // Controls login modal visibility
  const [user, setUser] = useState(null);                       // Logged-in user data
  const [showDropdown, setShowDropdown] = useState(false);      // Toggle profile dropdown
  const dropdownRef = useRef(null);                             // Reference to detect outside clicks
  const navigate = useNavigate();                               // Router navigation

  // Load user data from localStorage when component mounts
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Log out the user and clear session
  const handleLogout = () => {
    localStorage.removeItem("snappixUser");
    localStorage.removeItem("snappixSession");
    setUser(null);
    navigate('/');
    window.location.reload(); // Full refresh to clean up all session-based state
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Helper to get first name from full name
  const getFirstName = (fullName) => {
    return fullName?.split(" ")[0];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Create post: show login modal if not logged in
  const handleCreatePost = () => {
    if (user) {
      navigate('/create');
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Topbar layout */}
      <div className="bg-dark text-light px-4 py-2 d-flex justify-content-between align-items-center border-bottom border-secondary position-fixed top-0 w-100 z-3">
        
        {/* Logo */}
        <div className="d-flex align-items-center">
          <img src={logo} alt="Snappix Logo" height={40} className="me-3" />
        </div>

        {/* Search bar */}
        <input type="text" placeholder="Search" className="form-control mx-4 w-50 rounded-pill px-3" />

        {/* Right side buttons */}
        <div className="d-flex align-items-center gap-3">
          {/* Create Post */}
          <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={handleCreatePost}>
            + Create Post
          </button>

          {/* Profile Dropdown */}
          {user ? (
            <div ref={dropdownRef} className="position-relative d-flex align-items-center gap-2">
              <img
                src={user.picture}
                alt="Profile"
                className="rounded-circle"
                style={{ width: 32, height: 32, cursor: 'pointer' }}
                onClick={toggleDropdown}
              />
              <span onClick={toggleDropdown} style={{ cursor: 'pointer' }} title={user.email}>
                {getFirstName(user.name)}
              </span>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="position-absolute end-0 top-100 mt-2 bg-dark border border-secondary rounded shadow-sm z-3" style={{ minWidth: 180 }}>
                  <div className="px-3 py-2 border-bottom border-secondary bg-secondary text-white small rounded-top">
                    <strong>{getFirstName(user.name)}</strong><br />
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{user.email}</span>
                  </div>
                  <Link to="/profile" className="text-decoration-none text-light">
                    <div className="px-3 py-2 hover-bg-secondary">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Profile
                    </div>
                  </Link>
                  <button className="btn btn-sm text-start w-100 text-light px-3 py-2" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faLock} className="me-2 text-warning" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Log In button
            <button className="btn btn-outline-light" onClick={() => setShowModal(true)}>Log In</button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
}
