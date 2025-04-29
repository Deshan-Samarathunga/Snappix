import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructorName: '',
    instructorEmail: '',
    mediaUrls: []
  });

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    axios.get(`http://localhost:8080/api/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCourse(res.data);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          instructorName: res.data.instructorName,
          instructorEmail: res.data.instructorEmail,
          mediaUrls: res.data.mediaUrls || []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch course", err);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    const token = localStorage.getItem("snappixSession");
    if (window.confirm("Are you sure you want to delete this course?")) {
      axios.delete(`http://localhost:8080/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          alert("Course deleted successfully!");
          navigate("/");
        })
        .catch(err => {
          console.error("Failed to delete course", err);
          alert("Failed to delete course.");
        });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("snappixSession");
    axios.put(`http://localhost:8080/api/courses/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCourse(res.data);
        setIsEditing(false);
      })
      .catch(err => {
        console.error("Failed to update course", err);
        alert("Failed to update course.");
      });
  };

  if (loading) {
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

  if (!course) {
    return (
      <div className="bg-black text-white min-vh-100">
        <Topbar />
        <div className="d-flex">
          <Sidebar />
          <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
            <p>Course not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-vh-100">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container mt-5" style={{ marginLeft: '280px' }}>
          <div className="card text-white bg-dark shadow-lg p-4 rounded-4">
            <div className="card-body">
              {isEditing ? (
                <form onSubmit={handleEditSubmit}>
                  <h3 className="card-title text-primary fw-bold">Edit Course</h3>
                  <div className="mb-3">
                    <label className="form-label">Course Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Instructor Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="instructorName"
                      value={formData.instructorName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Instructor Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="instructorEmail"
                      value={formData.instructorEmail}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Media URLs (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.mediaUrls.join(', ')}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          mediaUrls: e.target.value.split(',').map(url => url.trim())
                        }))
                      }
                    />
                  </div>
                  <button type="submit" className="btn btn-success me-2">💾 Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>❌ Cancel</button>
                </form>
              ) : (
                <>
                  <h2 className="card-title mb-3 text-info fw-bold">{course.title}</h2>
                  <p className="card-text"><strong>Description:</strong> {course.description}</p>
                  <p className="card-text"><strong>Instructor:</strong> {course.instructorName}</p>
                  <p className="card-text"><strong>Email:</strong> {course.instructorEmail}</p>

                  {course.mediaUrls?.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-warning">Media</h5>
                      <div className="row">
                        {course.mediaUrls.map((url, idx) => (
                          <div className="col-md-4 mb-3" key={idx}>
                            <img src={url} alt={`media-${idx}`} className="img-fluid rounded shadow" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <button className="btn btn-outline-warning me-2" onClick={() => setIsEditing(true)}>✏️</button>
                    <button className="btn btn-outline-danger" onClick={handleDelete}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
