// client/src/pages/EditPost.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import './CreatePost.css'; // reuse styling

export default function EditPost() {
  const { id } = useParams();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    axios.get(`http://localhost:8080/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const desc = res.data.description || '';
        setTitle(desc.split('\n')[0]);
        setDescription(desc.split('\n').slice(1).join('\n'));
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to fetch post");
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("snappixSession");
    try {
      await axios.put(`http://localhost:8080/api/posts/${id}`, {
        description: title + '\n' + description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Post updated!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      toast.error("❌ Failed to update post");
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
          <div className="create-post-container bg-dark text-light p-4 rounded shadow w-100" style={{ maxWidth: '640px' }}>
            <h5 className="fw-bold mb-3">Edit Post</h5>

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="text-muted mb-1">Title (cannot edit):</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  value={title}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="text-muted mb-1">Description:</label>
                <textarea
                  className="form-control bg-dark text-light border-secondary"
                  rows="6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                <button type="submit" className="btn btn-warning">Save</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
