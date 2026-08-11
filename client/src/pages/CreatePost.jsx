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
    <div className="create-post-page">
      <Topbar />
      <div className="create-post-shell">
        <Sidebar />
        <main className="create-post-main">
          <section className="create-post-panel">
            <header className="create-post-header">
              <div>
                <p className="eyebrow-label">Share with your communities</p>
                <h1>Create post</h1>
              </div>
            </header>

            <div className="create-post-field">
              <label htmlFor="community-select">Community</label>
              <select
                id="community-select"
                className="create-post-select"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
              >
                <option value="">Select a community</option>
                {userCommunities.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="create-post-tabs" role="tablist">
              {['text', 'media', 'video'].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={`create-post-tab ${activeTab === tab ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  role="tab"
                  aria-selected={activeTab === tab}
                >
                  {tab === 'text' ? 'Text' : tab === 'media' ? 'Images' : 'Video'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="create-post-form">
              <div className="create-post-field">
                <label htmlFor="title-input">Title</label>
                <input
                  id="title-input"
                  type="text"
                  className="create-post-input"
                  placeholder="Add an attention-grabbing title"
                  maxLength={300}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <small>{title.length}/300</small>
              </div>

              {(activeTab === 'media' || activeTab === 'video') && (
                <div className="create-post-field">
                  <label>{activeTab === 'media' ? 'Images' : 'Video'}</label>
                  <div className="create-post-dropzone">
                    <p>Drag and drop files here</p>
                    <span>or</span>
                    <label className="create-post-upload">
                      <input
                        type="file"
                        accept={activeTab === 'media' ? 'image/*' : 'video/*'}
                        multiple={activeTab === 'media'}
                        onChange={handleFileChange}
                      />
                      Choose Files
                    </label>
                    <small>
                      {activeTab === 'media'
                        ? 'Max 3 images per post. Images only.'
                        : 'Single video up to 30 seconds.'}
                      <br />Cannot mix image and video types in a single post.
                    </small>
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="create-post-preview-grid">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="create-post-preview">
                          {media[index].type.startsWith('video/') ? (
                            <video src={url} muted loop />
                          ) : (
                            <img src={url} alt={`preview-${index}`} />
                          )}
                          <button type="button" onClick={() => removeMedia(index)} aria-label="Remove media" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="create-post-field">
                <label htmlFor="body-input">Body</label>
                <textarea
                  id="body-input"
                  className="create-post-textarea"
                  rows="5"
                  placeholder="Tell everyone what this post is about"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              <div className="create-post-actions">
                <button type="submit" className="pill-button create-post-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting…' : 'Post'}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
