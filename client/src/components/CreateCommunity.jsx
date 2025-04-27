// client/src/components/CreateCommunity.jsx

//remove these and uncomment
//import axios from 'axios';
//const res = await axios.post("http://localhost:8080/api/communities", formData, {
//Authorization: `Bearer ${token}`,
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import api from '../utils/axiosInstance';
import axios from 'axios';
import { toast } from 'react-toastify';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const topicsList = [
  "Filmmaking", "Photography", "Gear", "Editing", "Cinematic",
  "Analog", "Nature", "Portrait", "Urban", "Events", "Drone", "Experimental"
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
        : prev.length < 3
          ? [...prev, topic]
          : prev
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
      //const res = await api.post("/api/communities", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });


      const newCommunity = res.data;
      toast.success("✅ Community created!");
      navigate(`/c/${newCommunity.name}`); // redirect to community page
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      console.error(err); 
      toast.error("❌ Failed to create community.");
    }

  };

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
          <div className="w-100" style={{ maxWidth: '640px' }}>
            <h3 className="fw-bold mb-4">Create a Community</h3>

            {step === 1 && (
              <>
                <div className="mb-3">
                  <label className="form-label">Community Name*</label>
                  <input type="text" className="form-control bg-dark text-light border-secondary" value={name} required onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description*</label>
                  <textarea className="form-control bg-dark text-light border-secondary" value={description} required onChange={e => setDescription(e.target.value)} rows="4" />
                </div>
                <button className="btn btn-warning" onClick={() => setStep(2)}>Next</button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-3">
                  <label className="form-label">Upload Icon</label>
                  <input type="file" accept="image/*" className="form-control" onChange={e => setIcon(e.target.files[0])} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Upload Banner</label>
                  <input type="file" accept="image/*" className="form-control" onChange={e => setBanner(e.target.files[0])} />
                </div>
                <button className="btn btn-secondary me-2" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-warning" onClick={() => setStep(3)}>Next</button>
              </>
            )}

            {step === 3 && (
              <>
                <p>Select up to 3 topics that fit your community:</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {topicsList.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      className={`btn btn-sm ${selectedTopics.includes(topic) ? 'btn-info' : 'btn-outline-secondary'}`}
                      onClick={() => toggleTopic(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <button className="btn btn-secondary me-2" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-warning" onClick={() => setStep(4)}>Next</button>
              </>
            )}

            {step === 4 && (
              <>
                <h5 className="text-success">Confirm Details</h5>
                <ul className="list-group mb-3">
                  <li className="list-group-item bg-dark text-light">Name: {name}</li>
                  <li className="list-group-item bg-dark text-light">Description: {description}</li>
                  <li className="list-group-item bg-dark text-light">Topics: {selectedTopics.join(", ")}</li>
                </ul>
                <button className="btn btn-secondary me-2" onClick={() => setStep(3)}>Back</button>
                <button className="btn btn-success" onClick={handleSubmit}>Create Community</button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
