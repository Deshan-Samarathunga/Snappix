// client/src/components/CreateCommunity.jsx

//remove these and uncomment
//import axios from 'axios';
//const res = await axios.post("http://localhost:8080/api/communities", formData, {
//Authorization: `Bearer ${token}`,
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import './CreateCommunity.css';

const topicsList = [
  'Filmmaking',
  'Photography',
  'Gear',
  'Editing',
  'Cinematic',
  'Analog',
  'Nature',
  'Portrait',
  'Urban',
  'Events',
  'Drone',
  'Experimental',
];

const steps = [
  { id: 1, title: 'Basics', description: 'Name & description' },
  { id: 2, title: 'Branding', description: 'Icon & banner' },
  { id: 3, title: 'Topics', description: 'Choose up to three' },
  { id: 4, title: 'Review', description: 'Double-check details' },
];

export default function CreateCommunity() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [banner, setBanner] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : prev.length < 3
          ? [...prev, topic]
          : prev
    );
  };

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return name.trim().length >= 3 && description.trim().length >= 20;
      case 2:
        return true;
      case 3:
        return selectedTopics.length > 0;
      default:
        return true;
    }
  }, [step, name, description, selectedTopics]);

  const goToNext = () => {
    if (step < steps.length && canProceed) {
      setStep((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('snappixSession');
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('topics', JSON.stringify(selectedTopics));
      if (icon) formData.append('icon', icon);
      if (banner) formData.append('banner', banner);

      const response = await axios.post(
        'http://localhost:8080/api/communities',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Community created!');
      navigate(`/c/${response.data.name}`);
    } catch (err) {
      console.error('Error creating community', err.response?.data || err);
      toast.error('Failed to create community.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-stack">
            <label className="input-label">
              Community name
              <input
                className="input-control"
                placeholder="e.g. Cinematic Frames"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={32}
              />
            </label>
            <label className="input-label">
              Description
              <textarea
                className="input-control"
                placeholder="Tell the community who you are and what stories belong here."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <small className="field-hint">
              Aim for at least 20 characters so newcomers instantly understand the vibe.
            </small>
          </div>
        );
      case 2:
        return (
          <div className="form-stack">
            <label className="input-label">
              Icon (square works best)
              <input
                type="file"
                accept="image/*"
                className="input-control"
                onChange={(e) => setIcon(e.target.files[0])}
              />
            </label>
            <label className="input-label">
              Banner (optional)
              <input
                type="file"
                accept="image/*"
                className="input-control"
                onChange={(e) => setBanner(e.target.files[0])}
              />
            </label>
            <small className="field-hint">
              Banners look great at 1600×400px. You can update assets at any time.
            </small>
          </div>
        );
      case 3:
        return (
          <div className="form-stack">
            <p className="input-label">Select up to three topics</p>
            <div className="topic-grid">
              {topicsList.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className={`topic-chip ${selectedTopics.includes(topic) ? 'topic-chip--active' : ''}`}
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="form-stack">
            <h3 className="review-title">Almost there</h3>
            <div className="review-grid">
              <article>
                <span className="review-label">Name</span>
                <p>{name}</p>
              </article>
              <article>
                <span className="review-label">Description</span>
                <p>{description}</p>
              </article>
              <article>
                <span className="review-label">Topics</span>
                <p>{selectedTopics.join(', ') || '—'}</p>
              </article>
            </div>
          </div>
        );
    }
  };

  const progress = (step / steps.length) * 100;

  return (
    <div className="app-shell">
      <Topbar />
      <Sidebar />
      <main className="app-main create-community-main">
        <section className="glass-panel create-community-panel">
          <header className="create-community-header">
            <div>
              <p className="eyebrow-text">Community builder</p>
              <h1>Craft a new space</h1>
              <p className="subtitle">
                Guide creators with a memorable name, a quick story, and a few topics.
                It only takes a minute.
              </p>
            </div>
            <div className="builder-progress">
              <span>Step {step} of {steps.length}</span>
              <div className="progress-bar">
                <div className="progress-bar__value" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </header>

          <nav className="stepper">
            {steps.map(({ id, title }) => (
              <div key={id} className={`stepper-item ${step === id ? 'stepper-item--active' : ''}`}>
                <span>{id}</span>
                <p>{title}</p>
              </div>
            ))}
          </nav>

          <div className="step-body">{renderStep()}</div>

          <footer className="builder-actions">
            <button
              type="button"
              className="pill-button pill-button--ghost"
              onClick={goToPrevious}
              disabled={step === 1}
            >
              Back
            </button>
            {step < steps.length ? (
              <button
                type="button"
                className="pill-button pill-button--primary"
                onClick={goToNext}
                disabled={!canProceed}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                className="pill-button pill-button--primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing…' : 'Create community'}
              </button>
            )}
          </footer>
        </section>
      </main>
    </div>
  );
}
