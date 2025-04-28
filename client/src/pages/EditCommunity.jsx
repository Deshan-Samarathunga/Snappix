import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import './CreatePost.css'; // <-- use your new CSS

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
      <>
        <Topbar />
        <Sidebar />
        <div style={{ marginLeft: 240, padding: 40 }}>Loading...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar />
        <Sidebar />
        <div style={{ marginLeft: 240, padding: 40, color: "red" }}>{error}</div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <Sidebar />
      <div style={{ marginLeft: 240, padding: 40 }}>
        <div className="edit-community-container">
          <h2>Edit Community</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              value={name}
              maxLength={30}
              onChange={e => setName(e.target.value)}
              required
            />
            <label className="form-label">Description:</label>
            <textarea
              className="form-control"
              value={description}
              maxLength={200}
              onChange={e => setDescription(e.target.value)}
              required
              rows={3}
            />
            <label className="form-label">Topics (up to 3):</label>
            <div className="topic-btn-group">
              {topicsList.map(topic => (
                <button
                  key={topic}
                  type="button"
                  className={`topic-btn${selectedTopics.includes(topic) ? " selected" : ""}`}
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
            <label className="form-label">Icon (optional):</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={e => setIcon(e.target.files[0])}
            />
            <label className="form-label">Banner (optional):</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={e => setBanner(e.target.files[0])}
            />
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        </div>
      </div>
    </>
  );
}
