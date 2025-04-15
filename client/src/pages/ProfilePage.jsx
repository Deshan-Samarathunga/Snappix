// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import {
  faCommentDots,
  faUser,
  faCrown,
  faBirthdayCake,
  faCog,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  // Load initial user info from localStorage for immediate rendering
  const [userData, setUserData] = useState(() => {
    const user = localStorage.getItem("snappixUser");
    return user ? JSON.parse(user) : {};
  });

  const [tab, setTab] = useState('overview');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");

    // Redirect to homepage if no session token found
    if (!token) {
      navigate('/');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch user-related data using JWT
    const fetchData = async () => {
      try {
        const [userRes, postsRes, commentsRes, likesRes, dislikesRes] = await Promise.all([
          axios.get('http://localhost:8080/api/user/posts', { headers }),
          axios.get('http://localhost:8080/api/user/comments', { headers }),
          axios.get('http://localhost:8080/api/user/likes', { headers }),
          axios.get('http://localhost:8080/api/user/dislikes', { headers }),
        ]);

        // Optional debug logging
        console.log('User Data:', userRes.data);

        // Set all fetched data to state
        setUserData(userRes.data);
        setPosts(postsRes.data);
        setComments(commentsRes.data);
        setLikes(likesRes.data);
        setDislikes(dislikesRes.data);
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return null;

  // Handle dynamic tab content rendering
  const renderTabContent = () => {
    switch (tab) {
      case 'overview':
        return (
          <>
            <h5 className="text-warning">Recent Activity</h5>
            {posts.map((p, i) => (
              <div key={i} className="mb-3 border-bottom pb-2">
                <strong>Post:</strong> {p.text}
              </div>
            ))}
            {comments.map((c, i) => (
              <div key={i} className="mb-3 border-bottom pb-2">
                <strong>Comment:</strong> {c.text}
              </div>
            ))}
          </>
        );
      case 'posts':
        return posts.length ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {posts.map((post, i) => (
              <div className="col" key={i}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : <p>No posts yet</p>;

      case 'comments':
        return comments.length ? comments.map((c, i) => <p key={i}>• {c.text}</p>) : <p>No comments</p>;
      case 'likes':
        return likes.length ? likes.map((l, i) => <p key={i}>• {l.text}</p>) : <p>No likes</p>;
      case 'dislikes':
        return dislikes.length ? dislikes.map((d, i) => <p key={i}>• {d.text}</p>) : <p>No dislikes</p>;
      default:
        return <p>Coming soon...</p>;
    }
  };

  return (
    <div className="bg-black text-white min-vh-100 overflow-hidden">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <main
          className="flex-grow-1 px-4 pt-4 pb-5 d-flex"
          style={{
            marginLeft: '280px',
            marginTop: '60px',
            height: 'calc(100vh - 60px)',
            overflowY: 'auto',
            backgroundColor: '#1a1a1b',
          }}
        >
          {/* Left content area with profile header and tabs */}
          <div className="w-75 pe-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-3">
                {userData.picture ? (
                  <img src={userData.picture} alt="profile" className="rounded-circle" width={72} />
                ) : (
                  <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 72, height: 72 }}>
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                <div>
                  <h4 className="fw-bold mb-0">
                    {userData?.name?.trim() || "Unknown User"}
                  </h4>
                </div>
              </div>

              {/* Create post CTA */}
              <Link to="/create" className="btn btn-outline-light btn-sm rounded-pill px-4">
                + Create Post
              </Link>
            </div>

            {/* Navigation tabs */}
            <div className="d-flex gap-4 border-bottom mb-4 pb-2">
              {['overview', 'posts', 'comments', 'likes', 'dislikes'].map((key) => (
                <button
                  key={key}
                  className={`btn px-0 fw-semibold ${tab === key ? 'text-warning border-bottom border-warning' : 'text-secondary'}`}
                  style={{
                    background: 'transparent',
                    borderRadius: 0,
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none'
                  }}
                  onClick={() => setTab(key)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>

            {renderTabContent()}
          </div>

          {/* Right profile summary panel */}
          <div className="w-25 bg-dark p-3 rounded shadow-sm border border-secondary">
            <h6 className="mb-3 text-warning">{userData.name}</h6>
            <div className="mb-2">
              <FontAwesomeIcon icon={faCrown} className="me-2 text-warning" />
              55 post karma
            </div>
            <div className="mb-2">
              <FontAwesomeIcon icon={faCommentDots} className="me-2 text-info" />
              30 comment karma
            </div>
            <div className="mb-2">
              <FontAwesomeIcon icon={faBirthdayCake} className="me-2 text-light" />
              Joined: Mar 30, 2023
            </div>

            <hr className="border-secondary my-3" />

            <div className="mb-2">
              <FontAwesomeIcon icon={faImage} className="me-2 text-primary" />
              17 achievements
            </div>
            <button className="btn btn-sm btn-outline-light w-100 mb-3">View All</button>

            {/* Settings navigation */}
            <h6 className="text-muted">Settings</h6>
            <button className="btn btn-sm btn-outline-secondary w-100 mb-2">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Profile
            </button>
            <button className="btn btn-sm btn-outline-secondary w-100">
              <FontAwesomeIcon icon={faCog} className="me-2" />
              Account Settings
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
