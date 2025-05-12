// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { Container, Row, Col, Button, Nav, Tab } from 'react-bootstrap';

export default function ProfilePage() {
  const [userData, setUserData] = useState(() => {
    const user = localStorage.getItem("snappixUser");
    return user ? JSON.parse(user) : {};
  });

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("snappixSession");
    const user = localStorage.getItem("snappixUser");

    if (!token || !user) {
      navigate('/');
      return;
    }

    const parsedUser = JSON.parse(user);
    setUserData(parsedUser);

    axios.get('http://localhost:8080/api/posts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const userPosts = res.data.filter(p => p.userEmail === parsedUser.email);
        setPosts(userPosts);
      })
      .catch(err => console.error("Failed to fetch posts", err));
  }, [navigate]);

  return (
    <div className="bg-black text-white min-vh-100">
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1" style={{ marginLeft: '280px', marginTop: '60px' }}>
          <Container className="py-4">
            {/* Profile header */}
            <div className="bg-secondary rounded-top" style={{ height: '150px' }}></div>
            <div className="d-flex align-items-center p-3 bg-dark rounded-bottom border border-secondary">
              <div>
                {userData.picture ? (
                  <img
                    src={userData.picture}
                    alt="avatar"
                    className="rounded-circle border border-3 border-white"
                    style={{ width: 80, height: 80, marginTop: '-40px' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center"
                    style={{ width: 80, height: 80, marginTop: '-40px' }}
                  >
                    <strong>{userData?.name?.charAt(0) || '?'}</strong>
                  </div>
                )}
              </div>
              <div className="ms-3">
                <h4 className="mb-0">u/{userData?.name || 'Unknown'}</h4>
                <span className="text-muted">12,500 karma • Joined over 5 years ago</span>
              </div>
              <div className="ms-auto">
                <Button size="sm" variant="primary">Follow</Button>
              </div>
            </div>

            <Row className="mt-4">
              {/* About section */}
              <Col md={3}>
                <div className="bg-dark rounded p-3 border border-secondary mb-3">
                  <h6>About</h6>
                  <p className="text-muted small mb-1">🎂 Cake day: 1/1/2020</p>
                  <p className="text-light small">
                    Full-stack developer passionate about building great user experiences.
                    I love React, Next.js, and TypeScript.
                  </p>
                  <Button variant="outline-light" size="sm" className="w-100">Send Message</Button>
                </div>
              </Col>

              {/* Posts & Tabs */}
              <Col md={9}>
                <Tab.Container defaultActiveKey="posts">
                  <Nav variant="tabs" className="mb-3">
                    <Nav.Item><Nav.Link eventKey="posts">Posts</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="comments">Comments</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="saved">Saved</Nav.Link></Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="posts">
                      {posts.length === 0 ? (
                        <p className="text-muted">No posts yet.</p>
                      ) : (
                        posts.map(post => (
                          <PostCard key={post.id} post={post} />
                        ))
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="comments">
                      <p className="text-muted">No comments.</p>
                    </Tab.Pane>
                    <Tab.Pane eventKey="saved">
                      <p className="text-muted">No saved content.</p>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
}