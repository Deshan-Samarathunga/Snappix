import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import '../pages/Community.css';

const topicsList = [
  "Filmmaking", "Photography", "Gear", "Editing", "Cinematic", "Analog",
  "Nature", "Portrait", "Urban", "Events", "Drone", "Experimental"
];

export default function CreateCommunity() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [banner, setBanner] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("snappixSession");
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description);
      formData.append("topics", JSON.stringify(selectedTopics));
      if (icon) formData.append("icon", icon);
      if (banner) formData.append("banner", banner);

      const res = await axios.post("http://localhost:8080/api/communities", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      const newCommunity = res.data;
      toast.success("✅ Community created!");
      navigate(`/c/${newCommunity.name}`);
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      console.error(err);
      toast.error("❌ Failed to create community.");
    }
  };

  const renderStepIndicator = () => (
    <div style={{
      display: "flex", gap: 8, marginBottom: 24, justifyContent: "center"
    }}>
      {[1, 2].map(n => (
        <div key={n}
          style={{
            width: 28, height: 8, borderRadius: 8,
            background: step === n ? "#1976d2" : "#333",
            transition: "background 0.2s"
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <Topbar />
      <Sidebar />
      <div className="explore-bg" style={{ marginLeft: 240, minHeight: "100vh", padding: 40 }}>
        <div className="edit-community-container" style={{ maxWidth: 520, margin: "auto" }}>
          <h2 style={{ letterSpacing: 1, fontWeight: 800, color: "#90caf9", marginBottom: 8 }}>
            Create a Community
          </h2>
          <div style={{ color: "#B0B6C2", marginBottom: 28, fontSize: "1.1em" }}>
            Bring people together around your passion. Make it unique!
          </div>
          {renderStepIndicator()}
          {step === 1 && (
            <>
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                value={name}
                maxLength={30}
                onChange={e => setName(e.target.value)}
                required
                placeholder="e.g. Travel in Sri Lanka"
              />
              <label className="form-label">Description:</label>
              <textarea
                className="form-control"
                value={description}
                maxLength={200}
                onChange={e => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="What is your community about?"
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
              <button
                className="save-btn"
                style={{ marginTop: 12, width: 120, float: "right" }}
                onClick={() => setStep(2)}
                disabled={!name.trim() || !description.trim() || selectedTopics.length === 0}
                type="button"
              >
                Next
              </button>
              <div style={{ clear: "both" }} />
            </>
          )}
          {step === 2 && (
            <>
              <label className="form-label">Icon (optional):</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleIconChange}
              />
              {iconPreview && (
                <div style={{ marginBottom: 16 }}>
                  <img src={iconPreview} alt="icon preview" style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", border: "2px solid #1976d2" }} />
                </div>
              )}
              <label className="form-label">Banner (optional):</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleBannerChange}
              />
              {bannerPreview && (
                <div style={{ marginBottom: 16 }}>
                  <img src={bannerPreview} alt="banner preview" style={{ width: "100%", maxHeight: 120, borderRadius: 12, objectFit: "cover", border: "2px solid #1976d2" }} />
                </div>
              )}
              <div style={{ color: "#B0B6C2", marginBottom: 18 }}>
                <b>Name:</b> {name}<br />
                <b>Description:</b> {description}<br />
                <b>Topics:</b> {selectedTopics.join(", ")}
              </div>
              <button className="save-btn" type="button" onClick={handleSubmit}>Create Community</button>
              <button className="topic-btn" style={{ marginLeft: 12 }} type="button" onClick={() => setStep(1)}>Back</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
