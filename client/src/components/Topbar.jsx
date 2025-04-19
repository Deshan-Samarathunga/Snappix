// src/components/Topbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo/snappix_logo_white.png';
import LoginModal from './LoginModal';
import { getCurrentUser } from '../utils/getCurrentUser';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export default function Topbar() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiry = decoded.exp * 1000;
        const now = Date.now();
        const timeLeft = expiry - now;

        if (expiry > now) {
          setUser(getCurrentUser());

          if (timeLeft > 60000) {
            const warnTimer = setTimeout(() => {
              toast.warn("⚠️ You'll be logged out soon due to inactivity.", { autoClose: 5000 });
            }, timeLeft - 60000);

            const logoutTimer = setTimeout(() => {
              localStorage.removeItem("snappixUser");
              localStorage.removeItem("snappixSession");
              setUser(null);
              navigate('/');
              window.location.reload();
            }, timeLeft);

            return () => {
              clearTimeout(warnTimer);
              clearTimeout(logoutTimer);
            };
          }
        } else {
          localStorage.removeItem("snappixSession");
          localStorage.removeItem("snappixUser");
          setUser(null);
        }
      } catch {
        localStorage.removeItem("snappixSession");
        localStorage.removeItem("snappixUser");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("snappixUser");
    localStorage.removeItem("snappixSession");
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  const toggleDropdown = () => setShowDropdown(prev => !prev);
  const getFirstName = (fullName) => fullName?.split(" ")[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreatePost = () => {
    if (user) {
      navigate('/create');
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="bg-dark text-light px-4 py-2 d-flex justify-content-between align-items-center border-bottom border-secondary position-fixed top-0 w-100 z-3">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Snappix Logo" height={40} className="me-3" />
        </div>

        <input type="text" placeholder="Search" className="form-control mx-4 w-50 rounded-pill px-3" />

        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={handleCreatePost}>
            + Create Post
          </button>

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
            <button className="btn btn-outline-light" onClick={() => setShowModal(true)}>Log In</button>
          )}
        </div>
      </div>

      <LoginModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
}
