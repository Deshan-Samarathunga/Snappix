// src/components/CreateCommunity.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

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
  const [selectedTopics, setSelectedTopics] = useState([]);
  const navigate = useNavigate();

  const toggleTopic = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : prev.length < 3 ? [...prev, topic] : prev
    );
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
      toast.error("❌ Failed to create community.");
    }
  };

  return (
    <div className="bg-black text-white min-vh-100 overflow-hidden">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 px-5 pt-5" style={{ marginLeft: '280px', marginTop: '60px', backgroundColor: '#1a1a1b' }}>
          <h2 className="fw-bold mb-4">Create a Community</h2>
          {step === 1 && (
            <>
              <div>
                <label>Community Name</label>
                <input className="form-control mb-2" value={name} onChange={e => setName(e.target.value)} maxLength={32} />
                <label>Description</label>
                <textarea className="form-control mb-2" value={description} onChange={e => setDescription(e.target.value)} maxLength={200} />
                <label>Icon (optional)</label>
                <input type="file" accept="image/*" className="form-control mb-2" onChange={e => setIcon(e.target.files[0])} />
                <label>Banner (optional)</label>
                <input type="file" accept="image/*" className="form-control mb-2" onChange={e => setBanner(e.target.files[0])} />
                <label>Select up to 3 topics:</label>
                <div className="mb-3">
                  {topicsList.map(topic => (
                    <button
                      key={topic}
                      className={`btn btn-sm m-1 ${selectedTopics.includes(topic) ? "btn-info" : "btn-outline-info"}`}
                      onClick={() => toggleTopic(topic)}
                      type="button"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!name || !description || selectedTopics.length === 0}>
                  Next
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h5>Confirm Details</h5>
              <ul>
                <li><b>Name:</b> {name}</li>
                <li><b>Description:</b> {description}</li>
                <li><b>Topics:</b> {selectedTopics.join(", ")}</li>
                <li><b>Icon:</b> {icon ? icon.name : "None"}</li>
                <li><b>Banner:</b> {banner ? banner.name : "None"}</li>
              </ul>
              <button className="btn btn-secondary me-2" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-success" onClick={handleSubmit}>Create Community</button>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
