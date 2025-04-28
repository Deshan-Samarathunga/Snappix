// src/pages/CommunityPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import './Community.css';

export default function CommunityPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("snappixUser"));

  // Fetch community, posts, and members
  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    setLoading(true);
    axios.get(`http://localhost:8080/api/communities/name/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCommunity(res.data);
        setMembers([res.data.createdBy, ...(res.data.members || [])]);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Community not found.");
        setLoading(false);
      });

    axios.get(`http://localhost:8080/api/posts/community/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPosts(res.data))
      .catch(err => console.error("Failed to load posts", err));
  }, [name]);

  // Leave community
  const handleLeave = async () => {
    const token = localStorage.getItem("snappixSession");
    try {
      await axios.post(`http://localhost:8080/api/communities/leave/${name}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      alert("Failed to leave community.");
    }
  };

  // Promote member (for creator/moderator)
  const handlePromote = async (memberEmail) => {
    const token = localStorage.getItem("snappixSession");
    try {
      await axios.post(`http://localhost:8080/api/communities/${community.id}/promote`, { email: memberEmail }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Member promoted to moderator!");
      window.location.reload();
    } catch (err) {
      alert("Failed to promote member.");
    }
  };

  if (loading) {
    return (
      <>
        <Topbar />
        <Sidebar />
        <div style={{ marginLeft: 240, padding: 40 }}>Loading...</div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <Topbar />
        <Sidebar />
        <div style={{ marginLeft: 240, padding: 40, color: "red" }}>{error}</div>
      </>
    );
  }

  // User and permission checks
  const isCreator = user && community.createdBy === user.email;
  const isMember = user && (community.members || []).includes(user.email);
  const canCreatePost = user && (isCreator || isMember);

  return (
    <>
      <Topbar />
      <Sidebar />
      <div style={{ marginLeft: 240, padding: 40, maxWidth: 900 }}>
        <div className="edit-community-container" style={{ marginBottom: 32 }}>
          <h2 style={{ color: "#90caf9", marginBottom: 8 }}>{community.name}</h2>
          <div className="community-description">{community.description}</div>
          {community.topics?.length > 0 && (
            <div className="community-topics" style={{ marginBottom: 16 }}>
              {community.topics.map(topic => (
                <span className="community-topic-tag" key={topic}>{topic}</span>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div style={{ marginTop: 18, display: "flex", gap: 14, alignItems: "center" }}>
            {canCreatePost && (
              <button
                className="save-btn"
                onClick={() => navigate(`/create-post?community=${encodeURIComponent(community.name)}`)}
              >
                + Create Post
              </button>
            )}
            {!isCreator && isMember && (
              <button
                className="topic-btn"
                style={{ background: "#222", color: "#f66", border: "1.5px solid #f66" }}
                onClick={handleLeave}
              >
                Leave Community
              </button>
            )}
            <span style={{ color: "#B0B6C2", fontSize: "1.05em" }}>
              <b>{members.length}</b> member{members.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Members list and promote button */}
          <div style={{ marginTop: 18 }}>
            <div style={{ color: "#90caf9", fontWeight: 500, marginBottom: 6 }}>Members:</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {members.map(email => (
                <li key={email} style={{ color: "#F3F6FA", marginBottom: 2 }}>
                  {email === community.createdBy ? (
                    <span style={{ fontWeight: 700, color: "#ffd700" }}>{email} (creator)</span>
                  ) : (
                    <>
                      {email}
                      {isCreator && (
                        <button
                          className="topic-btn"
                          style={{ marginLeft: 8, fontSize: "0.95em", padding: "2px 10px" }}
                          onClick={() => handlePromote(email)}
                        >
                          Promote
                        </button>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h3 style={{ color: "#90caf9", marginBottom: 12 }}>Posts</h3>
          {posts.length === 0 ? (
            <div style={{ color: "#B0B6C2" }}>No posts yet.</div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
