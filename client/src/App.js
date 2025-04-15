// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CreatePost from './components/CreatePost';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateCommunity from './components/CreateCommunity';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/create-community" element={<PrivateRoute><CreateCommunity /></PrivateRoute>} />
          <Route path="/c/:name" element={<CommunityPage />} />
        </Routes>
      </Router>
      <ToastContainer position="top-center" autoClose={2500} />
    </>
  );
}

export default App;
