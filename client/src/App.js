// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CreatePost from './pages/CreatePost';
import CreateCommunity from './components/CreateCommunity';
import CommunityPage from './pages/CommunityPage';
import ExploreCommunities from './pages/ExploreCommunities';
import EditPost from './pages/EditPost';
import PrivateRoute from './components/PrivateRoute';
import SessionManager from './components/SessionManager';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        {/* Manages auto logout & refresh token logic */}
        <SessionManager />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/create-community" element={<PrivateRoute><CreateCommunity /></PrivateRoute>} />
          <Route path="/c/:name" element={<CommunityPage />} />
          <Route path="/explore" element={<PrivateRoute><ExploreCommunities /></PrivateRoute>} />
          <Route path="/edit-post/:id" element={<EditPost />} />
        </Routes>
      </Router>

      {/* Global toast message container */}
      <ToastContainer position="top-center" autoClose={2500} />
    </>
  );
}

export default App;
