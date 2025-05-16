// client/src/components/CreatePost.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreatePost.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function CreatePost() {
  const [activeTab, setActiveTab] = useState('text');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [media, setMedia] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [community, setCommunity] = useState('');
  const [userCommunities, setUserCommunities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('snappixSession');
    if (!token) return;
    axios.get('http://localhost:8080/api/communities/joined', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUserCommunities(res.data))
      .catch((err) => console.error('Failed to fetch communities', err));
  }, []);

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files);
    const selectedType = selected[0]?.type?.split('/')[0];
    const currentType = media[0]?.type?.split('/')[0];
    if (media.length > 0 && selectedType && currentType !== selectedType) {
      toast.warn(
        <>
          <FontAwesomeIcon icon={faBan} className="me-2" />
          You can only upload one type of media per post!
        </>
      );
      return;
    }
    setMedia([...media, ...selected]);
    setPreviewUrls([
      ...previewUrls,
      ...selected.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveMedia = (idx) => {
    setMedia((prev) => prev.filter((_, i) => i !== idx));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!community) {
      toast.warn("Please select a community before posting.");
      return;
    }
    if (!title.trim()) {
      toast.warn("Title is required.");
      return;
    }
    setIsSubmitting(true);

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
      toast.success(
        <>
          <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
          Post uploaded!
        </>
      );
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      setError(err.response?.data || "Unknown error");
      toast.error(
        <>
          <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
          Upload failed: {err.response?.data || "Unknown error"}
        </>
      );
    } finally {
      setIsSubmitting(false);
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
            backgroundColor: '#1a1a1b',
          }}
        >
          <div className="create-post-container bg-dark text-light p-4 rounded shadow w-100" style={{ maxWidth: '640px' }}>
            <h5 className="fw-bold mb-3">Create post</h5>

            {/* Community Dropdown */}
            <div className="mb-4">
              <select
                className="form-select bg-dark text-light border-secondary"
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
                    className={`nav-link ${activeTab === tab ? 'active' : ''} text-white`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'text' ? 'Text' : tab === 'media' ? 'Images' : 'Videos'}
                  </button>
                </li>
              ))}
            </ul>

            {/* Error display */}
            {error && (
              <div className="alert alert-danger py-2">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
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
                  <div className="d-flex flex-wrap mt-3 justify-content-center">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="position-relative m-2">
                        <img src={url} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => handleRemoveMedia(idx)}
                        >×</button>
                      </div>
                    ))}
                  </div>
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
                  <div className="d-flex flex-wrap mt-3 justify-content-center">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="position-relative m-2">
                        <video src={url} style={{ width: 80, height: 80, borderRadius: 8 }} controls />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => handleRemoveMedia(idx)}
                        >×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Area */}
              {(activeTab === 'text' || activeTab === 'media' || activeTab === 'video') && (
                <div className="mb-3">
                  <textarea
                    className="form-control bg-dark text-light border-secondary"
                    rows="5"
                    placeholder="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              )}

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-warning" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
