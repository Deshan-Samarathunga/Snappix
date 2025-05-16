import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreatePost.css';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';

export default function CreatePost() {
  const [activeTab, setActiveTab] = useState('text');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [media, setMedia] = useState([]);
  const [community, setCommunity] = useState('');
  const [userCommunities, setUserCommunities] = useState([]);
  const navigate = useNavigate();
  const { communityName } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    if (!token) return;

    axios.get("http://localhost:8080/api/communities/joined", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUserCommunities(res.data);
        // Pre-select community from URL if present
        if (communityName) {
          const found = res.data.find(
            c => c.name.toLowerCase() === decodeURIComponent(communityName).toLowerCase()
          );
          if (found) setCommunity(found.name);
        }
      })
      .catch(err => console.error("Failed to fetch communities", err));
  }, [communityName]);

  const handleFileChange = (e) => setMedia([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!community) {
      toast.warn("Please select a community before posting.");
      return;
    }

    const formData = new FormData();
    formData.append("userName", JSON.parse(localStorage.getItem("snappixUser")).name);
    formData.append("description", title + '\n' + body);
    formData.append("community", community.trim());
    media.forEach((file) => formData.append("media", file));

    try {
      const token = localStorage.getItem("snappixSession");
      await axios.post("http://localhost:8080/api/posts/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("✅ Post uploaded!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      toast.error("❌ Upload failed: " + (err.response?.data || "Unknown error"));
    }
  };

  return (
    <div className="bg-white text-dark min-vh-100 overflow-hidden">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <main
          className="flex-grow-1 px-4 pt-4 pb-5 d-flex justify-content-center"
          style={{
            marginLeft: '280px',
            marginTop: '60px',
            height: 'calc(100vh - 60px)',
            overflowY: 'auto',
            backgroundColor: '#f6f8fa',
          }}
        >
          <div className="create-post-container bg-white text-dark p-4 rounded shadow w-100" style={{ maxWidth: '640px' }}>
            <h5 className="fw-bold mb-3">Create post</h5>

            {/* Community Dropdown */}
            <div className="mb-4">
              <select
                className="form-select bg-white text-dark border-secondary"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
              >
                <option value="">Select a community</option>
                {userCommunities.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3 border-secondary">
              {['text', 'media', 'video'].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? 'active' : ''} text-dark`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'text' ? 'Text' : tab === 'media' ? 'Images' : 'Videos'}
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control bg-white text-dark border-secondary"
                  placeholder="Title"
                  maxLength={300}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <small className="text-muted">{title.length}/300</small>
              </div>

              {/* Media Upload */}
              {activeTab === 'media' && (
                <div className="mb-3 border border-secondary rounded p-5 text-center text-muted" style={{ borderStyle: 'dashed' }}>
                  <p className="mb-0">Drag and Drop images or</p>
                  <input
                    type="file"
                    className="form-control mt-2"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* Video Upload */}
              {activeTab === 'video' && (
                <div className="mb-3 border border-secondary rounded p-5 text-center text-muted" style={{ borderStyle: 'dashed' }}>
                  <p className="mb-0">Upload video or drag and drop</p>
                  <input
                    type="file"
                    className="form-control mt-2"
                    accept="video/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* Text Area */}
              {(activeTab === 'text' || activeTab === 'media' || activeTab === 'video') && (
                <div className="mb-3">
                  <textarea
                    className="form-control bg-white text-dark border-secondary"
                    rows="5"
                    placeholder="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              )}

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-warning">Post</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
