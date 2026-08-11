// src/pages/HomePage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import Topbar from '../components/Topbar';
import axios from 'axios';
import './HomePage.css';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Error fetching posts:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts;
    return posts.filter((post) =>
      (post.community || '').toLowerCase().includes(activeFilter)
    );
  }, [posts, activeFilter]);

  const highlightCommunities = useMemo(() => {
    const counts = posts.reduce((acc, post) => {
      if (!post.community) return acc;
      acc[post.community] = (acc[post.community] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [posts]);

  const filterOptions = [
    { value: 'all', label: 'All stories' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'analog', label: 'Analog' },
    { value: 'gear', label: 'Gear' },
  ];

  return (
    <div className="app-shell">
      <Topbar />
      <Sidebar />
      <main className="app-main home-main">
        <div className="home-layout">
          <section className="home-hero glass-panel">
            <div>
              <p className="eyebrow-text">Snappix daily</p>
              <h1>Share the story behind the shot</h1>
              <p className="home-hero-copy">
                Fresh frames from filmmakers, photographers, and storytellers around the world.
                Drop your best work, ask for critique, or discover a new community.
              </p>
            </div>
            <div className="home-hero-actions">
              <button
                type="button"
                className="pill-button pill-button--primary"
                onClick={() => navigate('/create-post')}
              >
                Create post
              </button>
              <button
                type="button"
                className="pill-button pill-button--ghost"
                onClick={() => navigate('/create-community')}
              >
                Launch community
              </button>
            </div>
          </section>

          <div className="home-grid">
            <section className="home-feed surface-card">
              <div className="home-feed-header">
                <h2>Featured feed</h2>
                <div className="chip-row">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`filter-chip ${activeFilter === option.value ? 'filter-chip--active' : ''}`}
                      onClick={() => setActiveFilter(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="content-stack home-feed-stack">
                {loading ? (
                  <div className="home-placeholder">Loading posts...</div>
                ) : filteredPosts.length ? (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} location="home" />
                  ))
                ) : (
                  <div className="home-placeholder">
                    {activeFilter === 'all'
                      ? 'No posts found yet. Be the first to share something today.'
                      : `Nothing tagged ${activeFilter}. Try another filter.`}
                  </div>
                )}
              </div>
            </section>

            <aside className="home-sidebar">
              <section className="surface-card home-card">
                <h3>Trending communities</h3>
                <ul>
                  {highlightCommunities.length === 0 && (
                    <li>No activity yet. Start by sharing your work.</li>
                  )}
                  {highlightCommunities.map(([communityName, count]) => (
                    <li key={communityName}>
                      <span>c/{communityName}</span>
                      <strong>{count}</strong>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="surface-card home-card">
                <h3>Quick actions</h3>
                <div className="quick-actions">
                  <button
                    type="button"
                    className="pill-button pill-button--ghost"
                    onClick={() => navigate('/create-post')}
                  >
                    Ask for critique
                  </button>
                  <button
                    type="button"
                    className="pill-button pill-button--ghost"
                    onClick={() => navigate('/create-community')}
                  >
                    Host a challenge
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
