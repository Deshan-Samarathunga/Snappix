// client/src/components/CreatePost.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreatePost.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { useDispatch } from 'react-redux';
import { addPost, setStatus, setError } from '../redux/postSlice';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('snappixSession');
    if (!token) return;

    axios.get('http://localhost:8080/api/communities/joined', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setUserCommunities(res.data))
      .catch((err) => console.error('Failed to fetch communities', err));
  }, []);

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files);
    const selectedType = selected[0]?.type?.split('/')[0];
    const currentType = media[0]?.type?.split('/')[0];

    if (media.length > 0 && selectedType && currentType !== selectedType) {
      toast.warn(<><FontAwesomeIcon icon={faBan} className="me-2 text-warning" />Cannot mix images and videos in one post.</>);
      return;
    }

    if (selectedType === 'video') {
      if (media.length > 0 || selected.length > 1) {
        toast.warn(<><FontAwesomeIcon icon={faBan} className="me-2 text-warning" />Only 1 video file allowed.</>);
        return;
      }

      const isTooLong = await checkVideoDuration(selected[0]);
      if (isTooLong) {
        toast.warn(<><FontAwesomeIcon icon={faBan} className="me-2 text-warning" />{selected[0].name} is longer than 30 seconds.</>);
        return;
      }

      const preview = URL.createObjectURL(selected[0]);
      setMedia([selected[0]]);
      setPreviewUrls([preview]);
      return;
    }

    if (selectedType === 'image') {
      const total = media.length + selected.length;
      if (total > 3) {
        toast.warn(<><FontAwesomeIcon icon={faBan} className="me-2 text-warning" />Maximum of 3 images allowed.</>);
        return;
      }

      const previews = selected.map((file) => URL.createObjectURL(file));
      setMedia((prev) => [...prev, ...selected]);
      setPreviewUrls((prev) => [...prev, ...previews]);
    }
  };

  const checkVideoDuration = (file) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(video.duration > 31);
      };
      video.src = url;
    });
  };

  const removeMedia = (index) => {
    const newMedia = [...media];
    const newPreviews = [...previewUrls];
    newMedia.splice(index, 1);
    newPreviews.splice(index, 1);
    setMedia(newMedia);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!community) {
      toast.warn(<><FontAwesomeIcon icon={faBan} className="me-2 text-warning" />Please select a community before posting.</>);
      return;
    }

    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem('snappixUser'));
    formData.append('userName', user.name);
    formData.append('description', title + '\n' + body);
    formData.append('community', community.trim());
    media.forEach((file) => formData.append('media', file));

    try {
      const token = localStorage.getItem('snappixSession');
      dispatch(setStatus('loading'));
      setIsSubmitting(true);

      const res = await axios.post('http://localhost:8080/api/posts/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(addPost(res.data));
      dispatch(setStatus('success'));
      toast.success(<><FontAwesomeIcon icon={faCheckCircle} className="me-2 text-success" />Post uploaded!</>);
      navigate(`/c/${community.trim()}`);
    } catch (err) {
      dispatch(setError(err.response?.data || 'Unknown error'));
      toast.error(<><FontAwesomeIcon icon={faTimesCircle} className="me-2 text-danger" />Upload failed: {err.response?.data || 'Unknown error'}</>);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white min-vh-100 overflow-hidden">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 px-4 pt-4 pb-5 d-flex justify-content-center" style={{ marginLeft: '280px', marginTop: '60px', height: 'calc(100vh - 60px)', overflowY: 'auto', backgroundColor: '#1a1a1b' }}>
          <div className="create-post-container bg-dark text-light p-4 rounded shadow w-100" style={{ maxWidth: '640px' }}>
            <h5 className="fw-bold mb-3">Create post</h5>

            <div className="mb-4">
              <select className="form-select bg-dark text-light border-secondary" value={community} onChange={(e) => setCommunity(e.target.value)}>
                <option value="">Select a community</option>
                {userCommunities.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <ul className="nav nav-tabs mb-3 border-secondary">
              {['text', 'media', 'video'].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button className={`nav-link ${activeTab === tab ? 'active' : ''} text-white`} onClick={() => setActiveTab(tab)}>
                    {tab === 'text' ? 'Text' : tab === 'media' ? 'Images' : 'Video'}
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input type="text" className="form-control bg-dark text-light border-secondary" placeholder="Title" maxLength={300} required value={title} onChange={(e) => setTitle(e.target.value)} />
                <small className="text-muted">{title.length}/300</small>
              </div>

              {(activeTab === 'media' || activeTab === 'video') && (
                <>
                  <div className="mb-3 border border-secondary rounded p-5 text-center text-muted" style={{ borderStyle: 'dashed' }}>
                    <p className="mb-0">Drag and Drop media or</p>
                    <input type="file" className="form-control mt-2" accept={activeTab === 'media' ? 'image/*' : 'video/*'} multiple onChange={handleFileChange} />
                    <small className="text-muted mt-2">Max 3 files. Videos must be under 30 seconds.<br />Cannot mix image and video types in a single post.</small>
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="position-relative">
                          {media[index].type.startsWith('video/') ? (
                            <video src={url} className="border border-secondary rounded" style={{ maxWidth: 130 }} muted />
                          ) : (
                            <img src={url} className="border border-secondary rounded" style={{ maxWidth: 130 }} alt={`preview-${index}`} />
                          )}
                          <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-1" onClick={() => removeMedia(index)} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="mb-3">
                <textarea className="form-control bg-dark text-light border-secondary" rows="5" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-warning" disabled={isSubmitting}>{isSubmitting ? 'Posting...' : 'Post'}</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
