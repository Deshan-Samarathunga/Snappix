// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  faImage, faHome, faComments, faCompass,
  faTags, faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

export default function Sidebar() {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    if (!token) return;

    axios.get("http://localhost:8080/api/communities/joined", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCommunities(res.data))
      .catch(err => console.error("Error fetching joined communities:", err));
  }, []);



  return (
    <aside className="sidebar-shell">
      <div className="sidebar-section">
        <Link to="/" className="sidebar-link fw-semibold">
          <FontAwesomeIcon icon={faHome} />
          Home
        </Link>
        <Link to="/explore" className="sidebar-link sidebar-link--accent fw-semibold">
          <FontAwesomeIcon icon={faCompass} />
          Explore Communities
        </Link>
        <Link to="/create-community" className="sidebar-link sidebar-pill">
          + Create a Community
        </Link>
      </div>

      {communities.length > 0 && (
        <div className="sidebar-section">
          <p className="sidebar-title">My communities</p>
          {communities.map(c => (
            <Link key={c.id} to={`/c/${c.name.trim()}`} className="sidebar-link">
              {c.iconUrl ? (
                <img src={c.iconUrl} alt={c.name} className="sidebar-community-avatar" />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} />
              )}
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <hr className="sidebar-divider" />

      <div className="sidebar-section sidebar-list-secondary">
        <p className="sidebar-title">Spotlight</p>
        <span className="sidebar-link">
          <FontAwesomeIcon icon={faImage} /> Cinematic
        </span>
        <span className="sidebar-link">
          <FontAwesomeIcon icon={faCompass} /> Discover
        </span>
        <span className="sidebar-link">
          <FontAwesomeIcon icon={faComments} /> Discussions
        </span>
        <span className="sidebar-link">
          <FontAwesomeIcon icon={faTags} /> Categories
        </span>
      </div>
    </aside>
  );
}
