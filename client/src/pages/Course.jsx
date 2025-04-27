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
      toast.success('✅ Course deleted');
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
            backgroundColor: '#000000',
          }}
        >
          <div
            className="bg-dark p-4 rounded shadow w-100"
            style={{ maxWidth: '640px' }}
          >
            {/* Course Details */}
            <h2 className="fw-bold mb-3">{course.courseName}</h2>
            <p><strong>Description:</strong> {course.description}</p>
            <p><strong>Category:</strong> {course.category}</p>
            <p><strong>Tutor:</strong> {course.tutorName}</p>
            <p><strong>Creator Email:</strong> {course.creatorEmail}</p>
            <p><strong>Creator WhatsApp:</strong> {course.creatorWhatsapp}</p>

            {/* Action Buttons */}
            <div className="d-flex gap-2 mt-4">
              {isContributor && (
                <>
                  <button className="btn btn-sm btn-warning" onClick={handleUpdate}>
                    Update
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </>
              )}
              <button className="btn btn-sm btn-success" onClick={handleEnroll}>
                Enroll Me
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
