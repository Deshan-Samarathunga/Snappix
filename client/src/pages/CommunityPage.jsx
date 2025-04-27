// src/pages/CommunityPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';

export default function CommunityPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [isModerator, setIsModerator] = useState(false); // ✨ New state

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    const user = JSON.parse(localStorage.getItem("snappixUser"));

    if (!token || !user) {
      navigate('/');
      return;
    }

    axios.get(`http://localhost:8080/api/communities/name/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCommunity(res.data);
        setError(null);

        // ✨ Check if user is the community creator
        if (res.data.createdBy === user.email) {
          setIsModerator(true);
        } else {
          setIsModerator(false);
        }
      })
      .catch(err => {
        console.error(err);
        setError("Community not found.");
      });

    axios.get(`http://localhost:8080/api/posts/community/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPosts(res.data))
      .catch(err => console.error("Failed to load posts", err));
  }, [name, navigate]);

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

  const handleAddCourse = () => {
    navigate(`/add-course?community=${community.name}`);
  };

  return (
    <div className="bg-black text-white min-vh-100">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
          {community.bannerUrl && <img src={community.bannerUrl} className="img-fluid mb-3 rounded" alt="banner" />}
          <h2 className="fw-bold mb-2">
            {community.name}
            {community.createdBy === JSON.parse(localStorage.getItem("snappixUser"))?.email ? (
              <span className="badge bg-warning text-dark ms-2">Moderator</span>
            ) : (
              community.members?.includes(JSON.parse(localStorage.getItem("snappixUser"))?.email) && (
                <span className="badge bg-info ms-2">Member</span>
              )
            )}
          </h2>
          <p className="text-light">{community.description}</p>
          {community.topics?.length > 0 && (
            <p className="text-light">Topics: {community.topics.join(', ')}</p>
          )}

          {/* Centered Tabs */}
          <div className="d-flex justify-content-center mt-4 mb-3">
            <div className="nav nav-tabs border-0">
              <button
                className={`nav-link ${activeTab === 'content' ? 'active' : ''} text-white`}
                style={{
                  backgroundColor: activeTab === 'content' ? '#333' : 'transparent',
                  border: 'none',
                  margin: '0 10px'
                }}
                onClick={() => setActiveTab('content')}
              >
                Posts
              </button>
              <button
                className={`nav-link ${activeTab === 'courses' ? 'active' : ''} text-white`}
                style={{
                  backgroundColor: activeTab === 'courses' ? '#333' : 'transparent',
                  border: 'none',
                  margin: '0 10px'
                }}
                onClick={() => setActiveTab('courses')}
              >
                Courses
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-3">
            {activeTab === 'content' && (
              <>
                <h5 className="mb-3">Posts</h5>
                {posts.length === 0 ? (
                  <p className="text-light">No posts in this community yet.</p>
                ) : (
                  posts.map(post => (
                    <PostCard key={post.id} post={post} location="community" />
                  ))
                )}
              </>
            )}

            {activeTab === 'courses' && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Courses</h5>
                  {isModerator && (
                    <button className="btn btn-sm btn-warning" onClick={handleAddCourse}>
                      Add a Course
                    </button>
                  )}
                </div>

                {/* Placeholder for course list */}
                <div className="text-muted">Courses related to {community.name} will appear here soon...</div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
