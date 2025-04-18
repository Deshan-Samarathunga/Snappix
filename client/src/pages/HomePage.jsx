// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import Topbar from '../components/Topbar';
import axios from 'axios';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/api/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error("Error fetching posts:", err))
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="bg-black text-white min-vh-100 overflow-hidden">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <main
          className="flex-grow-1 px-4 pt-4 pb-5"
          style={{
            marginLeft: '280px',
            marginTop: '60px',
            height: 'calc(100vh - 60px)',
            overflowY: 'auto',
            backgroundColor: '#000000'
          }}
        >
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} location="home" />
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </main>
      </div>
    </div>
  );
}
