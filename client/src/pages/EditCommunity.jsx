import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import './Community.css';

const topicsList = [
  "Filmmaking", "Photography", "Gear", "Editing", "Cinematic", "Analog",
  "Nature", "Portrait", "Urban", "Events", "Drone", "Experimental"
];

export default function EditCommunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [banner, setBanner] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    axios.get(`http://localhost:8080/api/communities/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setName(res.data.name);
        setDescription(res.data.description);
        setSelectedTopics(res.data.topics || []);
        setIconPreview(res.data.iconUrl || null);
        setBannerPreview(res.data.bannerUrl || null);
        setLoading(false);
      })
      .catch(err => {
        setError("Community not found or you do not have permission.");
        setLoading(false);
      });
  }, [id]);

  const toggleTopic = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : prev.length < 3
        ? [...prev, topic]
        : prev
    );
  };

  const handleIconChange = e => {
    const file = e.target.files[0];
    setIcon(file);
    setIconPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleBannerChange = e => {
    const file = e.target.files[0];
    setBanner(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("snappixSession");
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

  if (loading) {
    return (
      <div className="app-container">
        <Topbar />
        <div className="main-layout">
          <Sidebar />
          <div className="content-area">
            <div className="loading-container">Loading community...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Topbar />
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <div className="edit-community-container">
            <h2>Edit Community</h2>
            {error && <div className="error-container">{error}</div>}
            <form onSubmit={handleSubmit} autoComplete="off">
              <label className="form-label">Name:</label>
              <input
                className="form-control"
                type="text"
                value={name}
                disabled
              />

              <label className="form-label">Description:</label>
              <textarea
                className="form-control"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your community"
                maxLength={300}
              />

              <label className="form-label">Topics (up to 3):</label>
              <div className="topic-btn-group">
                {topicsList.map(topic => (
                  <button
                    type="button"
                    key={topic}
                    className={`topic-btn${selectedTopics.includes(topic) ? " selected" : ""}`}
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <label className="form-label">Icon (optional):</label>
              <input className="form-control" type="file" accept="image/*" onChange={handleIconChange} />
              {iconPreview && (
                <img src={iconPreview} alt="icon preview" style={{ width: 48, height: 48, borderRadius: 12, margin: '8px 0' }} />
              )}

              <label className="form-label">Banner (optional):</label>
              <input className="form-control" type="file" accept="image/*" onChange={handleBannerChange} />
              {bannerPreview && (
                <img src={bannerPreview} alt="banner preview" style={{ width: '100%', maxHeight: 80, borderRadius: 10, margin: '8px 0' }} />
              )}

              <button className="save-btn" type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
