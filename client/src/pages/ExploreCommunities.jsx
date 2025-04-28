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
    <div className="bg-black text-white min-vh-100 overflow-hidden">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 px-5 pt-5" style={{ marginLeft: '280px', marginTop: '60px', backgroundColor: '#1a1a1b' }}>
          <h2 className="fw-bold mb-4">Explore Communities</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {communities.map(c => (
              <div key={c.id} className="col">
                <div className="bg-dark text-light p-3 rounded border border-secondary h-100 position-relative">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    {c.iconUrl ? (
                      <img src={c.iconUrl} alt={c.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    ) : (
                      <div className="bg-secondary rounded-circle" style={{ width: 40, height: 40 }} />
                    )}
                    <div>
                      <h5 className="mb-0">{c.name}</h5>
                      <small className="text-muted">{c.description}</small><br />
                      <small className="text-muted">{c.members?.length || 0} members</small>
                    </div>
                    {/* Three-dot menu for creator */}
                    {c.createdBy === user?.email && (
                      <>
                        <IconButton
                          aria-label="more"
                          aria-controls={`menu-${c.id}`}
                          aria-haspopup="true"
                          size="small"
                          onClick={(e) => handleMenuOpen(e, c.id)}
                          style={{ marginLeft: "auto", color: "white" }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id={`menu-${c.id}`}
                          anchorEl={menuAnchorEls[c.id]}
                          open={Boolean(menuAnchorEls[c.id])}
                          onClose={() => handleMenuClose(c.id)}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                          <MenuItem onClick={() => handleEdit(c.id)}>
                            <EditIcon fontSize="small" style={{ marginRight: 8 }} />
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => handleDelete(c.id)}>
                            <DeleteIcon fontSize="small" style={{ marginRight: 8, color: "red" }} />
                            Delete
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    {joined[c.name] ? (
                      <button className="btn btn-sm btn-secondary" onClick={() => handleLeave(c.name)}>
                        Joined
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-outline-info" onClick={() => handleJoin(c.name)}>
                        Join
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-light" onClick={() => navigate(`/c/${c.name}`)}>
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
