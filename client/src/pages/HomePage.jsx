// src/pages/HomePage.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import Topbar from '../components/Topbar';
import { posts } from '../config/postsData';

export default function HomePage() {
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
            backgroundColor: '#1a1a1b'
          }}
        >
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>
      </div>
    </div>
  );
}
