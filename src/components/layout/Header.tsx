// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'Candidate';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4h12m-12 0a2 2 0 100 4m0-4a2 2 0 110 4m0-4h12m-6-9.38V2M5.67 7.62H2m20 0h-3.67" />
          </svg>
          <span className="text-xl font-bold tracking-tight">PrepAI</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          {token && (
            <span className="hidden md:block text-white/90 font-medium">
              Welcome, <span className="text-yellow-300 font-semibold">{username}</span>
            </span>
          )}
          
          {token ? (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-white/90 hover:text-white font-medium text-sm transition-all hover:translate-y-[-1px]">Dashboard</Link>
              <Link to="/interview" className="text-white/90 hover:text-white font-medium text-sm transition-all hover:translate-y-[-1px]">Interview</Link>
              <Link to="/saved" className="text-white/90 hover:text-white font-medium text-sm transition-all hover:translate-y-[-1px]">Saved</Link>
              <Link to="/analytics" className="text-white/90 hover:text-white font-medium text-sm transition-all hover:translate-y-[-1px]">Analytics</Link>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white/90 hover:text-white font-medium text-sm transition-all hover:translate-y-[-1px]">Dashboard</Link>
              <Link to="/login" className="text-white/90 hover:text-white font-medium text-sm transition-all hover:translate-y-[-1px]">Login</Link>
              <Link to="/register" className="text-white/90 hover:text-white font-medium text-sm transition-all hover:translate-y-[-1px]">Register</Link>  
            </nav>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="p-1 focus:outline-none text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {token && (
            <button 
              onClick={handleLogout} 
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <span>Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-900 backdrop-blur-sm shadow-lg py-3">
          <div className="container mx-auto px-4">
            {token ? (
              <nav className="flex flex-col space-y-3">
                <Link to="/dashboard" className="text-white py-2 px-2 hover:bg-white/10 rounded-md">Dashboard</Link>
                <Link to="/interview" className="text-white py-2 px-2 hover:bg-white/10 rounded-md">Interview</Link>
                <Link to="/saved" className="text-white py-2 px-2 hover:bg-white/10 rounded-md">Saved</Link>
                <Link to="/analytics" className="text-white py-2 px-2 hover:bg-white/10 rounded-md">Analytics</Link>
              </nav>
            ) : (
              <nav className="flex flex-col space-y-3">
                <Link to="/" className="text-white py-2 px-2 hover:bg-white/10 rounded-md">Dashboard</Link>
                <Link to="/login" className="text-white py-2 px-2 hover:bg-white/10 rounded-md">Login</Link>
                <Link to="/register" className="text-white py-2 px-2 hover:bg-white/10 rounded-md">Register</Link>
              </nav>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;