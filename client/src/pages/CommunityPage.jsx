// src/pages/CommunityPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import './CommunityPage.css';

export default function CommunityPage() {
  const { name } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    const token = localStorage.getItem('snappixSession');

    const fetchCommunity = async () => {
      setStatus({ loading: true, error: null });
      try {
        const [communityResponse, postsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/communities/name/${name}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8080/api/posts/community/${name}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCommunity(communityResponse.data);
        setPosts(postsResponse.data);
        setStatus({ loading: false, error: null });
      } catch (err) {
        console.error('Failed to load community', err);
        setStatus({
          loading: false,
          error: 'Community not found or you no longer have access.',
        });
      }
    };

    fetchCommunity();
  }, [name]);

  const currentUserEmail = JSON.parse(
    localStorage.getItem('snappixUser')
  )?.email;

  const isModerator = community?.createdBy === currentUserEmail;
  const isMember = community?.members?.includes(currentUserEmail);

  const roleBadge = isModerator
    ? 'Moderator'
    : isMember
      ? 'Member'
      : null;

  const renderState = (message) => (
    <div className="app-shell">
      <Topbar />
      <Sidebar />
      <main className="app-main community-main">
        <div className="surface-card community-state-card">
          <p>{message}</p>
        </div>
      </main>
    </div>
  );

  if (status.loading) {
    return renderState('Loading community...');
  }

  if (status.error) {
    return renderState(status.error);
  }

  if (!community) {
    return renderState('Community unavailable.');
  }

  const memberCount = community.members?.length || 0;
  const topicList = community.topics || [];

  return (
    <div className="app-shell">
      <Topbar />
      <Sidebar />
      <main className="app-main community-main">
        <div className="community-layout">
          <section className="community-hero glass-panel">
            <div
              className={`community-banner ${community.bannerUrl ? 'community-banner--image' : ''}`}
              style={
                community.bannerUrl
                  ? { backgroundImage: `url(${community.bannerUrl})` }
                  : undefined
              }
            />
            <div className="community-header">
              {community.iconUrl ? (
                <img
                  src={community.iconUrl}
                  alt={`${community.name} avatar`}
                  className="community-avatar"
                />
              ) : (
                <div className="community-avatar community-avatar--fallback">
                  {(community.name || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="community-name-row">
                  <h1>{community.name}</h1>
                  {roleBadge && <span className="community-role">{roleBadge}</span>}
                </div>
                <p className="community-handle">c/{community.name?.toLowerCase()}</p>
                <p className="community-description">{community.description}</p>
                <div className="community-stats">
                  <div>
                    <strong>{memberCount.toLocaleString()}</strong>
                    <span>Members</span>
                  </div>
                  <div>
                    <strong>{posts.length}</strong>
                    <span>Posts</span>
                  </div>
                  <div>
                    <strong>{topicList.length}</strong>
                    <span>Topics</span>
                  </div>
                </div>
              </div>
              <div className="community-actions">
                <button className="pill-button pill-button--ghost" type="button">
                  Share
                </button>
                <button className="pill-button pill-button--primary" type="button">
                  Create Post
                </button>
              </div>
            </div>
          </section>

          <section className="community-feed surface-card">
            <header className="community-feed-header">
              <h2>Latest posts</h2>
              <span className="community-feed-meta">
                {posts.length ? `${posts.length} stories shared` : 'Be the first to post'}
              </span>
            </header>
            <div className="content-stack">
              {posts.length === 0 ? (
                <div className="community-empty-state">
                  <p>No posts in this community yet. Spark the first conversation.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} location="community" />
                ))
              )}
            </div>
          </section>

          <aside className="community-sidebar">
            <section className="surface-card community-card">
              <h3>About this community</h3>
              <p className="community-card-text">
                Created by <strong>{community.createdBy}</strong>
              </p>
              {topicList.length > 0 && (
                <div className="community-topics">
                  {topicList.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
              )}
            </section>

            <section className="surface-card community-card">
              <h3>House rules</h3>
              <ul>
                <li>Stay cinematic and constructive.</li>
                <li>Credit original creators when sharing.</li>
                <li>Use clear titles so others can find your work.</li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
