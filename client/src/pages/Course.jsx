// src/pages/Course.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';

export default function Course() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [isContributor, setIsContributor] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('snappixSession');
    const user = JSON.parse(localStorage.getItem('snappixUser'));

    axios.get(`http://localhost:8080/api/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCourse(res.data);
        if (user?.email === res.data.creatorEmail) {
          setIsContributor(true);
        }
      })
      .catch(err => {
        console.error(err);
        setError('Course not found.');
      });
  }, [id]);

  if (error) {
    return (
      <div className="bg-black text-white min-vh-100">
        <Topbar />
        <div className="d-flex">
          <Sidebar />
          <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
            <h3>{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-black text-white min-vh-100">
        <Topbar />
        <div className="d-flex">
          <Sidebar />
          <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
            <p>Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdate = () => {
    navigate(`/edit-course/${id}`);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('snappixSession');
      await axios.delete(`http://localhost:8080/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Course deleted successfully');
      navigate(`/c/${course.community}`);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to delete course');
    }
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('snappixSession');
      await axios.post(`http://localhost:8080/api/courses/${id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('🎉 Enrolled successfully!');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to enroll');
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
            backgroundColor: '#1a1a1a',
          }}
        >
          <div
            className="bg-dark p-4 rounded shadow w-100"
            style={{ maxWidth: '640px' }}
          >
            {/* Course Details */}
            <h2 className="fw-bold mb-4 text-warning">{course.courseName}</h2>

            <div className="mb-3">
              <strong>Description:</strong>
              <p className="text-light">{course.description}</p>
            </div>

            <div className="mb-3">
              <strong>Category:</strong>
              <p className="text-light">{course.category}</p>
            </div>

            <div className="mb-3">
              <strong>Tutor Name:</strong>
              <p className="text-light">{course.tutorName}</p>
            </div>

            <div className="mb-3">
              <strong>Creator Email:</strong>
              <p className="text-light">{course.creatorEmail}</p>
            </div>

            <div className="mb-3">
              <strong>Creator WhatsApp No.:</strong>
              <p className="text-light">{course.creatorWhatsapp}</p>
            </div>

            {/* Action Buttons - at bottom */}
            <div className="d-flex justify-content-end gap-2 mt-5">
              {isContributor && (
                <>
                  <button className="btn btn-warning btn-sm" onClick={handleUpdate}>
                    Update
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                    Delete
                  </button>
                </>
              )}
              <button className="btn btn-success btn-sm" onClick={handleEnroll}>
                Enroll Me
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
