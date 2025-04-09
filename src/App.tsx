// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import InterviewSession from './pages/interviewSession';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedQuestions from './pages/SavedQuestions';
import ProtectedRoute from './components/ProtectedRoute';
import Analytics from './pages/Analytics';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
            <Route 
              path="/interview" 
              element={
                <ProtectedRoute>
                  <InterviewSession />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/saved" 
              element={
                <ProtectedRoute>
                  <SavedQuestions />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <footer className="py-4 bg-gray-800 text-gray-300 text-center text-sm">
          © {new Date().getFullYear()} AI-Powered Mock Interview Platform
        </footer>
      </div>
    </Router>
  );
};

export default App;