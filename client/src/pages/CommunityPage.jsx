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
        <Sidebar />
        <main className="flex-grow-1 px-5 pt-5">
          <h2>{error}</h2>
        </main>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="bg-black text-white min-vh-100">
        <Topbar />
        <Sidebar />
        <main className="flex-grow-1 px-5 pt-5">
          <h2>Loading community...</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-vh-100">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 px-5 pt-5" style={{ marginLeft: '280px', marginTop: '60px', backgroundColor: '#1a1a1b' }}>
          <h2 className="fw-bold mb-2">{community.name}</h2>
          <p>{community.description}</p>
          {community.topics?.length > 0 && (
            <div>
              <b>Topics:</b> {community.topics.join(', ')}
            </div>
          )}
          <div className="mt-4">
            <h4>Posts</h4>
            {posts.length === 0 ? (
              <div>No posts in this community yet.</div>
            ) : (
              posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
