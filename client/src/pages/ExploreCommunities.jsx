import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './Community.css';

export default function ExploreCommunities() {
  const [communities, setCommunities] = useState([]);
  const [joined, setJoined] = useState({});
  const [menuAnchorEls, setMenuAnchorEls] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("snappixUser"));

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    axios.get("http://localhost:8080/api/communities", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCommunities(res.data);
        const joinedMap = {};
        res.data.forEach(c => {
          if (c.createdBy === user?.email || c.members?.includes(user?.email)) {
            joinedMap[c.name] = true;
          }
        });
        setJoined(joinedMap);
      })
      .catch(err => console.error("Error loading communities", err));
  }, [user?.email]);

  const handleJoin = (name) => {
    const token = localStorage.getItem("snappixSession");
    axios.post(`http://localhost:8080/api/communities/join/${name}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setJoined(prev => ({ ...prev, [name]: true })))
      .catch(err => alert("Join failed: " + (err.response?.data || err.message)));
  };

  const handleLeave = (name) => {
    const token = localStorage.getItem("snappixSession");
    axios.post(`http://localhost:8080/api/communities/leave/${name}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setJoined(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      }))
      .catch(err => alert("Leave failed: " + (err.response?.data || err.message)));
  };

  // Menu logic
  const handleMenuOpen = (event, id) => {
    setMenuAnchorEls(prev => ({ ...prev, [id]: event.currentTarget }));
  };
  const handleMenuClose = (id) => {
    setMenuAnchorEls(prev => ({ ...prev, [id]: null }));
  };
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this community?")) return;
    const token = localStorage.getItem("snappixSession");
    axios.delete(`http://localhost:8080/api/communities/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setCommunities(prev => prev.filter(c => c.id !== id)))
      .catch(err => alert("Delete failed: " + (err.response?.data || err.message)));
    handleMenuClose(id);
  };
  const handleEdit = (id) => {
    navigate(`/edit-community/${id}`);
    handleMenuClose(id);
  };

  return (
    <>
      <Topbar />
      <Sidebar />
      <div className="explore-bg" style={{
        marginLeft: 240,
        padding: 40,
        minHeight: "100vh",
        background: "#181A1B"
      }}>
        <h2 style={{ marginBottom: 24, color: "#F3F6FA" }}>Explore Communities</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
          {communities.map(c => (
            <div
              key={c.id}
              className="edit-community-container"
              style={{
                minWidth: 320,
                maxWidth: 360,
                marginBottom: 24,
                position: "relative",
                background: "#23272F",
                color: "#F3F6FA",
                border: "1.5px solid #222",
                boxShadow: "0 2px 24px #0004"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: "#90caf9",
                      cursor: "pointer"
                    }}
                    onClick={() => navigate(`/c/${c.name}`)}>
                    {c.name}
                  </div>
                  <div className="community-description">{c.description}</div>
                  {c.topics?.length > 0 && (
                    <div className="community-topics">
                      {c.topics.map(topic => (
                        <span className="community-topic-tag" key={topic}>{topic}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ color: "#B0B6C2", fontSize: "0.95rem", marginTop: 6 }}>
                    {c.members?.length || 0} members
                  </div>
                </div>
                {(c.createdBy === user?.email) && (
                  <div>
                    <IconButton size="small" onClick={e => handleMenuOpen(e, c.id)}>
                      <MoreVertIcon style={{ color: "#90caf9" }} />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchorEls[c.id]}
                      open={Boolean(menuAnchorEls[c.id])}
                      onClose={() => handleMenuClose(c.id)}
                    >
                      <MenuItem onClick={() => handleEdit(c.id)}>
                        <EditIcon fontSize="small" style={{ marginRight: 8 }} /> Edit
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(c.id)}>
                        <DeleteIcon fontSize="small" style={{ marginRight: 8 }} /> Delete
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                {joined[c.name] ? (
                  <button className="save-btn" style={{ background: "#444" }} onClick={() => handleLeave(c.name)}>
                    Leave
                  </button>
                ) : (
                  <button className="save-btn" onClick={() => handleJoin(c.name)}>
                    Join
                  </button>
                )}
                <button
                  className="topic-btn"
                  style={{ background: "#23272F", color: "#90caf9", border: "1.5px solid #1976d2" }}
                  onClick={() => navigate(`/c/${c.name}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
