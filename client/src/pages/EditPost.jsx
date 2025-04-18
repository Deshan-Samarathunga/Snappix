import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

  const handleUpdate = async () => {
    const token = localStorage.getItem("snappixSession");
    try {
      await axios.put(`http://localhost:8080/api/posts/${id}`, {
        description: title + '\n' + description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Post updated!");
      navigate("/profile");
    } catch (err) {
      toast.error("Failed to update post");
    }
  };

  return (
    <div className="bg-black text-white min-vh-100 p-4">
      <h4 className="mb-3">Edit Post</h4>
      <p className="text-muted mb-1">Title (cannot edit):</p>
      <div className="form-control bg-dark text-light mb-3" readOnly>{title}</div>

      <p className="text-muted mb-1">Description:</p>
      <textarea
        className="form-control bg-dark text-light border-secondary"
        rows="8"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
        <button className="btn btn-warning" onClick={handleUpdate}>Save</button>
      </div>
    </div>
  );
}
