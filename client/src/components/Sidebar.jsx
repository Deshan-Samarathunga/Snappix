// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  faImage, faHome, faComments, faCompass,
  faTags, faUserCircle
} from '@fortawesome/free-solid-svg-icons';

const sidebarButtonClass = "d-flex align-items-center gap-2 px-3 py-2 rounded text-light sidebar-hover";

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
    <div className="bg-dark text-light p-3 position-fixed start-0 z-2"
      style={{ top: '60px', width: '280px', height: 'calc(100vh - 60px)', overflowY: 'auto' }}>


      <style>{`
        .sidebar-hover:hover {
          background-color: #2a2a2c;
          color: #ffffff;
        }
      `}</style>

      {/* + Create a Community */}
      <div className="mb-3">

        {/* Home Link */}
        <Link
          to="/"
          className={`${sidebarButtonClass} text-decoration-none fw-semibold`}
        >
          <FontAwesomeIcon icon={faHome} />
          Home
        </Link>

        {/* Explore Communities */}
        <Link
          to="/explore"
          className={`${sidebarButtonClass} text-decoration-none text-info fw-semibold mt-2`}
        >
          <FontAwesomeIcon icon={faCompass} />
          Explore Communities
        </Link>


        {/* + Create a Community */}
        <Link
          to="/create-community"
          className={`${sidebarButtonClass} text-decoration-none text-info fw-semibold mt-2`}
        >
          + Create a Community
        </Link>

        {/* My Communities */}
        {communities.length > 0 && (
          <div className="mt-3">
            {communities.map(c => (
              <Link
                key={c.id}
                to={`/c/${c.name.trim()}`}
                className={`${sidebarButtonClass} text-decoration-none`}
              >
                {c.iconUrl ? (
                  <img src={c.iconUrl} alt={c.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                ) : (
                  <FontAwesomeIcon icon={faUserCircle} />
                )}
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>


      {/* Navigation */}
      <hr className="border-secondary" />
      <h6 className="text-muted text-uppercase">Explore</h6>
      <div className="mb-3">
        {/* Removed Photography */}
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faImage} /> Cinematic</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faCompass} /> Discover</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faComments} /> Discussions</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faTags} /> Categories</div>
        <div className="px-3 text-info">See more</div>
      </div>

    </div>
  );
}
