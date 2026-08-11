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
import './Topbar.css';

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
      <div className="topbar">
        <div className="topbar__brand">
          <img src={logo} alt="Snappix Logo" height={40} />
        </div>

        <div className="topbar__search">
          <input type="text" placeholder="Search posts, people or communities" />
        </div>

        <div className="topbar__actions">
          <button className="pill-button pill-button--ghost" onClick={handleCreatePost}>
            + Create Post
          </button>

          {user ? (
            <div ref={dropdownRef} className="position-relative d-flex align-items-center gap-2">
              <img
                src={user.picture}
                alt="Profile"
                className="topbar__avatar"
                onClick={toggleDropdown}
              />
              <span onClick={toggleDropdown} style={{ cursor: 'pointer' }} title={user.email}>
                {getFirstName(user.name)}
              </span>

              {showDropdown && (
                <div className="dropdown-panel">
                  <div className="dropdown-panel__header">
                    <strong>{getFirstName(user.name)}</strong><br />
                    <span className="text-muted-soft small">{user.email}</span>
                  </div>
                  <Link to="/profile" className="dropdown-panel__link" onClick={() => setShowDropdown(false)}>
                    <FontAwesomeIcon icon={faUser} />
                    Profile
                  </Link>
                  <button type="button" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faLock} className="text-warning me-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="pill-button pill-button--primary" onClick={() => setShowModal(true)}>Log In</button>
          )}
        </div>
      </div>

      <LoginModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
}
