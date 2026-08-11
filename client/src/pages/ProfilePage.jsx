// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import './ProfilePage.css';

export default function ProfilePage() {
  const [userData, setUserData] = useState(() => {
    const user = localStorage.getItem("snappixUser");
    return user ? JSON.parse(user) : {};
  });

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    const user = localStorage.getItem("snappixUser");

    if (!token || !user) {
      navigate('/');
      return;
    }

    const parsedUser = JSON.parse(user);
    setUserData(parsedUser);

    axios.get('http://localhost:8080/api/posts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const userPosts = res.data.filter(p => p.userEmail === parsedUser.email);
        setPosts(userPosts);
      })
      .catch(err => console.error("Failed to fetch posts", err));
  }, [navigate]);

  const avatarInitial = userData?.name?.charAt(0)?.toUpperCase() || '?';

  const renderActiveTab = () => {
    if (activeTab === 'posts') {
      return posts.length ? (
        posts.map(post => <PostCard key={post.id} post={post} location="profile" />)
      ) : (
        <div className="profile-empty-state">
          <p>No posts yet. Start sharing your stories with the community.</p>
        </div>
      );
    }
    if (activeTab === 'comments') {
      return (
        <div className="profile-empty-state">
          <p>No comments yet. Join conversations across communities.</p>
        </div>
      );
    }
    return (
      <div className="profile-empty-state">
        <p>No saved items yet. Tap the bookmark icon on a post to save it for later.</p>
      </div>
    );
  };

  return (
    <div className="app-shell">
      <Topbar />
      <Sidebar />
      <main className="app-main profile-main">
        <div className="profile-layout">
          <section className="profile-hero glass-panel">
            <div className="profile-cover" />
            <div className="profile-header">
              {userData.picture ? (
                <img src={userData.picture} alt="avatar" className="profile-avatar" />
              ) : (
                <div className="profile-avatar profile-avatar--fallback">{avatarInitial}</div>
              )}
              <div className="profile-meta">
                <h1>{userData?.name || 'Anonymous Snapper'}</h1>
                <p className="profile-username">u/{(userData?.name || 'unknown').toLowerCase()}</p>
                <div className="profile-stats">
                  <div>
                    <strong>12.5k</strong>
                    <span>Karma</span>
                  </div>
                  <div>
                    <strong>5y</strong>
                    <span>Member</span>
                  </div>
                </div>
              </div>
              <div className="profile-actions">
                <button className="pill-button pill-button--ghost">Follow</button>
                <button className="pill-button pill-button--primary">Message</button>
              </div>
            </div>
          </section>

          <aside className="profile-sidebar">
            <section className="surface-card profile-card">
              <h2>About</h2>
              <p className="profile-muted-text">🎂 Cake day: Jan 1, 2020</p>
              <p className="profile-description">
                Full-stack developer passionate about building expressive experiences. Loves React, Next.js, and visual storytelling.
              </p>
              <div className="profile-tags">
                <span>Design</span>
                <span>Web3</span>
                <span>Photography</span>
              </div>
            </section>

            <section className="surface-card profile-card">
              <h2>Highlights</h2>
              <ul className="profile-highlights">
                <li>
                  <span className="label">Communities founded</span>
                  <strong>03</strong>
                </li>
                <li>
                  <span className="label">Ongoing streak</span>
                  <strong>18 days</strong>
                </li>
                <li>
                  <span className="label">Followers</span>
                  <strong>2,140</strong>
                </li>
              </ul>
            </section>
          </aside>

          <section className="profile-feed glass-panel">
            <div className="profile-tabs">
              {['posts', 'comments', 'saved'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`profile-tab ${activeTab === tab ? 'profile-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="profile-feed-content">
              {renderActiveTab()}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}