// src/pages/CommunityPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';


export default function CommunityPage() {
  const { name } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");

    // Fetch community
    axios.get(`http://localhost:8080/api/communities/name/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCommunity(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Community not found.");
      });

    // Fetch posts
    axios.get(`http://localhost:8080/api/posts/community/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPosts(res.data))
      .catch(err => console.error("Failed to load posts", err));
  }, [name]);

  if (error) {
    return (
      <div className="bg-black text-white min-vh-100">
        <Topbar />
        <div className="d-flex">
          <Sidebar />
          <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
            <h3>{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="bg-black text-white min-vh-100">
        <Topbar />
        <div className="d-flex">
          <Sidebar />
          <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
            <p>Loading community...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentUserEmail = JSON.parse(localStorage.getItem("snappixUser"))?.email;
  const roleBadge = community.createdBy === currentUserEmail
    ? <span className="badge bg-warning text-dark ms-2">Moderator</span>
    : community.members?.includes(currentUserEmail)
      ? <span className="badge bg-info ms-2">Member</span>
      : null;

  return (
    <div className="bg-black text-white min-vh-100">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
          {community.bannerUrl && <img src={community.bannerUrl} className="img-fluid mb-3 rounded" alt="banner" />}
          <h2 className="fw-bold">
            {community.name} {roleBadge}
          </h2>
          <p className="text-light">{community.description}</p>
          {community.topics?.length > 0 && (
            <p className="text-light">Topics: {community.topics.join(', ')}</p>
          )}

          <hr className="border-secondary" />
          <h5 className="mb-3">Posts</h5>
          {posts.length === 0 ? (
            <p className="text-light">No posts in this community yet.</p>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} location="community" />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
