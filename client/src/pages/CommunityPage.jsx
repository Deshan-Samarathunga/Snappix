// src/pages/CommunityPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';

export default function CommunityPage() {
  const { name } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch community
    axios.get(`http://localhost:8080/api/communities/name/${name}`)
      .then(res => {
        setCommunity(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Community not found.");
      });

    // Fetch posts in that community
    axios.get(`http://localhost:8080/api/posts/community/${name}`)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
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

  return (
    <div className="bg-black text-white min-vh-100">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
          {community.bannerUrl && <img src={community.bannerUrl} className="img-fluid mb-3 rounded" alt="banner" />}
          <h2 className="fw-bold">r/{community.name}</h2>
          <p className="text-muted">{community.description}</p>
          {community.topics?.length > 0 && (
            <p className="text-muted">Topics: {community.topics.join(', ')}</p>
          )}

          <hr className="border-secondary" />
          <h5 className="mb-3">Posts</h5>
          {posts.length === 0 ? (
            <p className="text-muted">No posts in this community yet.</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="mb-4 p-3 border rounded bg-dark text-light">
                <p className="fw-bold mb-1">{post.userEmail}</p>
                <p>{post.description}</p>
                {post.mediaUrls?.map((url, i) => (
                  <div key={i} className="mb-2">
                    {url.endsWith('.mp4') ? (
                      <video src={url} controls className="w-100 rounded" />
                    ) : (
                      <img src={url} alt="media" className="img-fluid rounded" />
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
