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
  const [isEditing, setIsEditing] = useState(false);  // To toggle edit mode
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
          navigate("/"); // 👈 redirect to home or community page
        })
        .catch(err => {
          console.error("Failed to delete course", err);
          alert("Failed to delete course.");
        });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
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
        setIsEditing(false);  // Toggle off edit mode
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
        <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
          <h2 className="fw-bold">{course.title}</h2>

          {/* Toggle between details and edit form */}
          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Course Name:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="instructorName" className="form-label">Instructor Name:</label>
                <input
                  type="text"
                  id="instructorName"
                  name="instructorName"
                  className="form-control"
                  value={formData.instructorName}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="instructorEmail" className="form-label">Instructor Email:</label>
                <input
                  type="email"
                  id="instructorEmail"
                  name="instructorEmail"
                  className="form-control"
                  value={formData.instructorEmail}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="mediaUrls" className="form-label">Media URLs (comma separated):</label>
                <input
                  type="text"
                  id="mediaUrls"
                  name="mediaUrls"
                  className="form-control"
                  value={formData.mediaUrls.join(', ')}
                  onChange={(e) => setFormData(prevState => ({
                    ...prevState,
                    mediaUrls: e.target.value.split(',').map(url => url.trim())
                  }))}
                />
              </div>

              <button type="submit" className="btn btn-success me-2">Save Changes</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          ) : (
            <div>
              {/* Course Details */}
              <div className="mb-3">
                <strong>Course Name: </strong>{course.title}
              </div>
              <div className="mb-3">
                <strong>Description: </strong>{course.description}
              </div>
              <div className="mb-3">
                <strong>Instructor:</strong> {course.instructorName} <br />
                <strong>Email:</strong> {course.instructorEmail}
              </div>

              {/* Media */}
              {course.mediaUrls?.length > 0 && (
                <div className="mb-3">
                  <h5>Media</h5>
                  {course.mediaUrls.map((url, idx) => (
                    <img key={idx} src={url} alt={`media-${idx}`} className="img-fluid mb-2 rounded" />
                  ))}
                </div>
              )}

              {/* Edit and Delete Buttons */}
              <div className="mb-3">
                <button className="btn btn-warning me-2" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
