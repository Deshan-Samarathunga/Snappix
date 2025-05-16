import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './Community.css';

export default function CommunityPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moderators, setModerators] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [menuAnchorEls, setMenuAnchorEls] = useState({});
  const presenceInterval = useRef(null);
  const user = JSON.parse(localStorage.getItem("snappixUser"));

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    setLoading(true);

    axios.get(`http://localhost:8080/api/communities/name/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // Support both {community, onlineCount} and plain community object
        const communityData = res.data.community || res.data;
        setCommunity(communityData);
        setModerators(communityData.moderators || []);
        setOnlineCount(res.data.onlineCount || 0);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        setError("Community not found.");
        setLoading(false);
      });

    axios.get(`http://localhost:8080/api/posts/community/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPosts(res.data))
      .catch(() => {});

    // Online presence tracking
    axios.post(`http://localhost:8080/api/communities/presence/${name}/join`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOnlineCount(res.data))
      .catch(err => console.error("Failed to report presence", err));

    presenceInterval.current = setInterval(() => {
      axios.get(`http://localhost:8080/api/communities/presence/${name}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setOnlineCount(res.data))
        .catch(err => console.error("Failed to get online count", err));
    }, 30000);

    return () => {
      axios.post(`http://localhost:8080/api/communities/presence/${name}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Failed to report leaving", err));

      if (presenceInterval.current) {
        clearInterval(presenceInterval.current);
      }
    };
  }, [name]);

  const handleJoin = async () => {
    const token = localStorage.getItem("snappixSession");
    try {
      const response = await axios.post(`http://localhost:8080/api/communities/join/${name}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommunity(response.data.community);
      setModerators(response.data.community.moderators || []);
      setOnlineCount(response.data.onlineCount || 0);
    } catch {
      alert("Failed to join community.");
    }
  };

  const handleLeave = async () => {
    const token = localStorage.getItem("snappixSession");
    try {
      const response = await axios.post(`http://localhost:8080/api/communities/leave/${name}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommunity(response.data.community);
      setModerators(response.data.community.moderators || []);
      setOnlineCount(response.data.onlineCount || 0);
    } catch {
      alert("Failed to leave community.");
    }
  };

  const handlePromoteMember = async (memberEmail) => {
    const token = localStorage.getItem("snappixSession");
    handleMenuClose(memberEmail);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/communities/promote/${name}/${memberEmail}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommunity(response.data);
      setModerators(response.data.moderators || []);
      alert(`Promoted ${memberEmail} to moderator!`);
    } catch (err) {
      alert(
        err.response?.data ||
        err.message ||
        "Failed to promote member."
      );
    }
  };

  const handleRemoveMember = async (memberEmail) => {
    const token = localStorage.getItem("snappixSession");
    handleMenuClose(memberEmail);

    if (!window.confirm(`Are you sure you want to remove ${memberEmail} from the community?`)) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/communities/remove-member/${name}/${memberEmail}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommunity(response.data.community);
      setModerators(response.data.community.moderators || []);
      setOnlineCount(response.data.onlineCount || 0);
      alert(`Removed ${memberEmail} from community`);
    } catch (err) {
      alert(
        err.response?.data ||
        err.message ||
        "Failed to remove member."
      );
    }
  };

  // Menu open/close logic for each member
  const handleMenuOpen = (event, memberEmail) => {
    event.stopPropagation();
    setMenuAnchorEls(prev => ({ ...prev, [memberEmail]: event.currentTarget }));
  };

  const handleMenuClose = (memberEmail) => {
    setMenuAnchorEls(prev => ({ ...prev, [memberEmail]: null }));
  };

  if (loading) {
    return (
      <div className="app-container">
        <Topbar />
        <div className="main-layout">
          <Sidebar />
          <div className="content-area">
            <div className="loading-container">Loading community...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Topbar />
        <div className="main-layout">
          <Sidebar />
          <div className="content-area">
            <div className="error-container">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const isMember = user && (
    community.createdBy === user.email ||
    (community.members && community.members.includes(user.email))
  );

  const isModerator = user && moderators.includes(user.email);

  const getLetterAvatar = (name) => {
    const letter = name.charAt(0).toUpperCase();
    return (
      <div className="community-header-letter">{letter}</div>
    );
  };

  return (
    <div className="app-container">
      <Topbar />
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          {/* Community Header */}
          <div className="community-header-banner">
            <div className="community-header-content">
              {getLetterAvatar(community.name)}
              <div className="community-header-info">
                <h1>c/{community.name}</h1>
                <div className="community-header-meta">
                  <span>{community.members?.length || 0} members</span>
                  {onlineCount > 0 && (
                    <>
                      <span>•</span>
                      <span>{onlineCount} online</span>
                    </>
                  )}
                </div>
              </div>
              {user && (
                isMember ? (
                  <button className="leave-btn" onClick={handleLeave}>Leave</button>
                ) : (
                  <button className="join-btn" onClick={handleJoin}>Join</button>
                )
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="community-page-content">
            {/* Posts Feed */}
            <div className="community-posts-list">
              {posts.length === 0 ? (
                <div className="no-posts-message">
                  No posts in this community yet. Be the first to post!
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="community-post-item">
                    <PostCard post={post} />
                  </div>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="community-sidebar">
              {/* About/Description Card */}
              <div className="about-community-card">
                <h3>About c/{community.name}</h3>
                <p className="community-description">
                  {community.description && community.description.trim()
                    ? community.description
                    : <span style={{ color: '#B0B6C2', fontStyle: 'italic' }}>No Description</span>
                  }
                </p>
                <div className="community-stats">
                  <div className="stat-box">
                    <span className="stat-number">{community.members?.length || 0}</span>
                    <span className="stat-label">Members</span>
                  </div>
                  {onlineCount > 0 && (
                    <div className="stat-box">
                      <span className="stat-number">{onlineCount}</span>
                      <span className="stat-label">Online</span>
                    </div>
                  )}
                </div>
                <div className="community-metadata">
                  <p className="created-info">
                    Created by: {community.createdBy || 'unknown'}
                    {community.createdAt &&
                      <span> on {new Date(community.createdAt).toLocaleDateString()}</span>
                    }
                  </p>
                </div>
                {isMember && (
                  <button
                    className="create-post-btn full-width"
                    onClick={() => navigate('/create-post', { state: { communityName: community.name } })}
                  >
                    Create a post
                  </button>
                )}
              </div>

              {/* Moderator List Card */}
              <div className="moderator-list-card">
                <h4>Moderators</h4>
                <ul className="moderator-list">
                  {moderators.length === 0 ? (
                    <li>No moderators</li>
                  ) : (
                    moderators.map((mod, idx) => (
                      <li key={idx} className="moderator-item">
                        {typeof mod === 'string' ? mod : mod.name}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Member List Card (Visible only to moderators) */}
              {isModerator && (
                <div className="members-list-card">
                  <h4>Members</h4>
                  {community.members && community.members.length > 0 ? (
                    <ul className="members-list">
                      {community.members.map((memberEmail, idx) => (
                        <li key={idx} className="member-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span>{memberEmail}</span>
                          <div onClick={e => e.stopPropagation()}>
                            <IconButton
                              size="small"
                              aria-controls={`member-menu-${idx}`}
                              aria-haspopup="true"
                              onClick={e => handleMenuOpen(e, memberEmail)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                            <Menu
                              id={`member-menu-${idx}`}
                              anchorEl={menuAnchorEls[memberEmail]}
                              open={Boolean(menuAnchorEls[memberEmail])}
                              onClose={() => handleMenuClose(memberEmail)}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                            >
                              {!moderators.includes(memberEmail) && (
                                <MenuItem onClick={() => handlePromoteMember(memberEmail)}>
                                  Moderator
                                </MenuItem>
                              )}
                              {memberEmail !== community.createdBy && (
                                <MenuItem
                                  onClick={() => handleRemoveMember(memberEmail)}
                                  style={{ color: "#d32f2f" }}
                                >
                                  Remove
                                </MenuItem>
                              )}
                            </Menu>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No members yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
