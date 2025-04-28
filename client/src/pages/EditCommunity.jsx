// src/pages/EditCommunity.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import './CreatePost.css'; // reuse styling if you want

const topicsList = [
  "Filmmaking", "Photography", "Gear", "Editing", "Cinematic", "Analog",
  "Nature", "Portrait", "Urban", "Events", "Drone", "Experimental"
];

export default function EditCommunity() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [community, setCommunity] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [banner, setBanner] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);

  // Fetch community info
  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    axios.get(`http://localhost:8080/api/communities/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCommunity(res.data);
        setName(res.data.name);
        setDescription(res.data.description);
        setSelectedTopics(res.data.topics || []);
        setLoading(false);
      })
      .catch(err => {
        setError("Community not found or you do not have permission.");
        setLoading(false);
      });
  }, [id]);

  // Topic toggle
  const toggleTopic = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : prev.length < 3
        ? [...prev, topic]
        : prev
    );
  };

  // Submit handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("snappixSession");
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description);
      formData.append("topics", JSON.stringify(selectedTopics));
      if (icon) formData.append("icon", icon);
      if (banner) formData.append("banner", banner);

      await axios.put(`http://localhost:8080/api/communities/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("✅ Community updated!");
      setTimeout(() => navigate(`/c/${name}`), 1000);
    } catch (err) {
      setError("❌ Failed to update community. " + (err.response?.data || ""));
    }
  };

  // UI
  if (loading) {
    return (
      <div className="bg-black text-white min-vh-100 overflow-hidden">
        <Topbar />
        <div className="d-flex">
          <Sidebar />
          <main style={{ marginLeft: '280px', padding: 40 }}>Loading...</main>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-black text-white min-vh-100 overflow-hidden">
        <Topbar />
        <div className="d-flex">
          <Sidebar />
          <main style={{ marginLeft: '280px', padding: 40, color: "red" }}>{error}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-vh-100 overflow-hidden">
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
            backgroundColor: '#000000',
          }}
        >
          <div className="create-post-container bg-dark text-light p-4 rounded shadow w-100" style={{ maxWidth: '640px' }}>
            <h5 className="fw-bold mb-3">Edit Community</h5>
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="mb-3">
                <label className="text-muted mb-1">Name:</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  value={name}
                  maxLength={30}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="text-muted mb-1">Description:</label>
                <textarea
                  className="form-control bg-dark text-light border-secondary"
                  rows="3"
                  maxLength={200}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="text-muted mb-1">Topics (up to 3):</label>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {topicsList.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      style={{
                        margin: 4,
                        padding: "4px 12px",
                        borderRadius: 16,
                        border: selectedTopics.includes(topic) ? "2px solid #ffc107" : "1px solid #ccc",
                        background: selectedTopics.includes(topic) ? "#fffbe6" : "#222",
                        color: selectedTopics.includes(topic) ? "#000" : "#fff",
                        cursor: "pointer"
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="text-muted mb-1">Icon (optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control bg-dark text-light border-secondary"
                  onChange={e => setIcon(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label className="text-muted mb-1">Banner (optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control bg-dark text-light border-secondary"
                  onChange={e => setBanner(e.target.files[0])}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                <button type="submit" className="btn btn-warning">Save</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
