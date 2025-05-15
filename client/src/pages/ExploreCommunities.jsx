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
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import './Community.css';

export default function ExploreCommunities() {
  const [communities, setCommunities] = useState([]);
  const [joined, setJoined] = useState({});
  const [menuAnchorEls, setMenuAnchorEls] = useState({});
  const [sortBy, setSortBy] = useState('members');
  const [search, setSearch] = useState('');
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

  const handleJoin = (name, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("snappixSession");
    axios.post(`http://localhost:8080/api/communities/join/${name}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setJoined(prev => ({ ...prev, [name]: true })))
      .catch(err => alert("Join failed: " + (err.response?.data || err.message)));
  };

  const handleLeave = (name, e) => {
    e.stopPropagation();
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
    event.stopPropagation();
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

  const handleSortChange = (criteria) => setSortBy(criteria);

  // Sorting and searching
  const filteredCommunities = communities
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'members') {
        return (b.members?.length || 0) - (a.members?.length || 0);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  // Avatar letter
  const getLetterAvatar = (name) => {
    const letter = name.charAt(0).toUpperCase();
    return (
      <div className="community-letter">{letter}</div>
    );
  };

  return (
    <div className="app-container">
      <Topbar />
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <div className="communities-container">
            <h1 className="communities-heading">Communities</h1>
            <p className="communities-subheading">Discover and join communities based on your interests</p>
            <div className="communities-search-sort">
              <input
                type="text"
                placeholder="Search communities..."
                className="communities-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="sort-options">
                <span>Sort by:</span>
                <button
                  className={`sort-btn ${sortBy === 'members' ? 'active' : ''}`}
                  onClick={() => handleSortChange('members')}
                >Members</button>
                <button
                  className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                  onClick={() => handleSortChange('name')}
                >Name</button>
                <button
                  className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                  onClick={() => handleSortChange('date')}
                >Date</button>
              </div>
            </div>
            <div className="community-grid">
              {filteredCommunities.map(community => (
                <div
                  key={community.id}
                  className="community-card"
                  onClick={() => navigate(`/c/${community.name}`)}
                >
                  <div className="community-card-header">
                    {getLetterAvatar(community.name)}
                    <h3 className="community-name">c/{community.name}</h3>
                    {/* Dropdown for edit/delete if user is creator */}
                    {user && community.createdBy === user.email && (
                      <div className="menu-container" onClick={e => e.stopPropagation()}>
                        <IconButton
                          size="small"
                          onClick={e => handleMenuOpen(e, community.id)}
                          className="more-options-btn"
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={menuAnchorEls[community.id]}
                          open={Boolean(menuAnchorEls[community.id])}
                          onClose={() => handleMenuClose(community.id)}
                        >
                          <MenuItem onClick={() => handleEdit(community.id)}>
                            <EditIcon fontSize="small" style={{ marginRight: 8 }} />
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => handleDelete(community.id)}>
                            <DeleteIcon fontSize="small" style={{ marginRight: 8, color: '#d32f2f' }} />
                            <span style={{ color: '#d32f2f' }}>Delete</span>
                          </MenuItem>
                        </Menu>
                      </div>
                    )}
                  </div>
                  <p className="community-description">
                    {community.description && community.description.trim()
                      ? community.description
                      : <span style={{ color: '#B0B6C2', fontStyle: 'italic' }}>No Description</span>
                    }
                  </p>
                  <div className="community-meta">
                    <PeopleAltIcon style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 4 }} />
                    <span>{community.members?.length || 0} members</span>
                  </div>
                  <div className="community-actions">
                    {user && (
                      joined[community.name] ? (
                        <button
                          className="leave-btn"
                          onClick={e => handleLeave(community.name, e)}
                        >Leave</button>
                      ) : (
                        <button
                          className="join-btn"
                          onClick={e => handleJoin(community.name, e)}
                        >Join</button>
                      )
                    )}
                    <button
                      className="visit-btn"
                      onClick={e => { e.stopPropagation(); navigate(`/c/${community.name}`); }}
                    >Visit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
