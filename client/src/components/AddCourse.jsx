// src/pages/AddCourse.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddCourse() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const communityName = queryParams.get('community') || '';

  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorWhatsapp, setCreatorWhatsapp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!communityName) {
      toast.error("Community name missing!");
      return;
    }

    try {
      const token = localStorage.getItem("snappixSession");
      await axios.post(`http://localhost:8080/api/courses`, {
        courseName,
        description,
        category,
        tutorName,
        creatorEmail,
        creatorWhatsapp,
        community: communityName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("✅ Course added successfully!");
      setTimeout(() => navigate(`/c/${communityName}`), 1500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("❌ Failed to add course");
    }
  };

  return (
    <div className="bg-black text-white min-vh-100">
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
          <div
            className="bg-dark p-4 rounded shadow w-100 d-flex flex-column"
            style={{
              maxWidth: '640px',
              minHeight: 'calc(100vh - 120px)',
            }}
          >
            {/* Header */}
            <div className="mb-4 text-center">
              <h4 className="fw-bold text-warning">Add New Course</h4>
              <p className="text-muted">Fill in the details to add a course to the community.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Course Name*</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description*</label>
                <textarea
                  className="form-control bg-dark text-light border-secondary"
                  rows="4"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Category*</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tutor Name*</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  required
                  value={tutorName}
                  onChange={(e) => setTutorName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Creator Email*</label>
                <input
                  type="email"
                  className="form-control bg-dark text-light border-secondary"
                  required
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Creator WhatsApp No.*</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  required
                  value={creatorWhatsapp}
                  onChange={(e) => setCreatorWhatsapp(e.target.value)}
                />
              </div>

              {/* Footer - Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-warning">
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
