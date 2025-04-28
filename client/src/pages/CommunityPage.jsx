import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';

export default function CommunityPage() {
  const { name } = useParams();
  const navigate = useNavigate();  // We need navigate for programmatic navigation
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]); 
  const [error, setError] = useState(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    instructorName: '',
    instructorEmail: '',
    mediaUrls: []
  });

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");

    // Fetch community
    axios.get(`http://localhost:8080/api/communities/name/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCommunity(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Community not found.");
      });

    // Fetch posts
    axios.get(`http://localhost:8080/api/posts/community/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPosts(res.data))
      .catch(err => console.error("Failed to load posts", err));

    // Fetch courses
    axios.get(`http://localhost:8080/api/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCourses(res.data))
      .catch(err => console.error("Failed to load courses", err));

  }, [name]);

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prevState => ({
      ...prevState,
      [name]: value // Only update the specific field
    }));
  };

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("snappixSession");

    axios.post('http://localhost:8080/api/courses', newCourse, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCourses(prevCourses => [...prevCourses, res.data]);  // Add the new course to the courses list
        setIsAddingCourse(false);  // Close the form after successful submission
        setNewCourse({
          title: '',
          description: '',
          instructorName: '',
          instructorEmail: '',
          mediaUrls: []
        });
        alert("Course added successfully!");
      })
      .catch(err => {
        console.error("Failed to add course", err);
        alert("Failed to add course.");
      });
  };

  const handleViewCourse = (courseId) => {
    // Navigate to the course details page for the selected course
    navigate(`/course/${courseId}`);
  };

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

  if (!community) {
    return (
      <div className="bg-black text-white min-vh-100">
        <Topbar />
        <div className="d-flex">
          <Sidebar />
          <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
            <p>Loading community...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentUserEmail = JSON.parse(localStorage.getItem("snappixUser"))?.email;
  const roleBadge = community.createdBy === currentUserEmail
    ? <span className="badge bg-warning text-dark ms-2">Moderator</span>
    : community.members?.includes(currentUserEmail)
      ? <span className="badge bg-info ms-2">Member</span>
      : null;

  const communityCourses = courses;

  return (
    <div className="bg-black text-white min-vh-100">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100" style={{ marginLeft: '280px', marginTop: '60px' }}>
          {community.bannerUrl && <img src={community.bannerUrl} className="img-fluid mb-3 rounded" alt="banner" />}
          <h2 className="fw-bold">
            {community.name} {roleBadge}
          </h2>
          <p className="text-light">{community.description}</p>
          {community.topics?.length > 0 && (
            <p className="text-light">Topics: {community.topics.join(', ')}</p>
          )}

          <hr className="border-secondary" />

          {/* Add Course Button */}
          <button className="btn btn-primary mb-3" onClick={() => setIsAddingCourse(!isAddingCourse)}>
            {isAddingCourse ? 'Cancel' : 'Add Course'}
          </button>

          {/* Add Course Form */}
          {isAddingCourse && (
            <form onSubmit={handleCourseSubmit} className="bg-dark p-3 rounded mb-4">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Course Name:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={newCourse.title}
                  onChange={handleCourseChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={newCourse.description}
                  onChange={handleCourseChange}
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
                  value={newCourse.instructorName}
                  onChange={handleCourseChange}
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
                  value={newCourse.instructorEmail}
                  onChange={handleCourseChange}
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
                  value={newCourse.mediaUrls.join(', ')}
                  onChange={(e) => setNewCourse(prevState => ({
                    ...prevState,
                    mediaUrls: e.target.value.split(',').map(url => url.trim())
                  }))}
                />
              </div>

              <button type="submit" className="btn btn-success">Add Course</button>
            </form>
          )}

          <hr className="border-secondary" />

          {/* COURSES SECTION */}
          <h5 className="mb-3">Courses</h5>
          {communityCourses.length === 0 ? (
            <p className="text-light">No courses available for this community yet.</p>
          ) : (
            <ul className="list-group mb-4">
              {communityCourses.map(course => (
                <li key={course.id} className="list-group-item bg-dark text-light">
                  {course.title}
                  <button
                    className="btn btn-info ms-2"
                    onClick={() => handleViewCourse(course.id)} // View Course button
                  >
                    View Course
                  </button>
                </li>
              ))}
            </ul>
          )}

          <hr className="border-secondary" />

          {/* POSTS SECTION */}
          <h5 className="mb-3">Posts</h5>
          {posts.length === 0 ? (
            <p className="text-light">No posts in this community yet.</p>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} location="community" />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
