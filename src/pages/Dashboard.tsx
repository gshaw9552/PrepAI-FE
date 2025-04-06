import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'Candidate';
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios
        .get('/api/analytics', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setAnalytics(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching analytics:", err);
          setLoading(false);
        });
    }
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {token ? (
        <>
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, {username}</h1>
            <p className="text-gray-500 text-lg">
              Ready to elevate your interview skills? Your personalized dashboard awaits.
            </p>
          </div>
          
          {/* Analytics Section */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : analytics ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Interviews</p>
                    <p className="text-gray-800 text-3xl font-bold">{analytics.completedInterviews || 0}</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Average Score</p>
                    <p className="text-gray-800 text-3xl font-bold">{analytics.averageScore || 'N/A'}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Saved Questions</p>
                    <p className="text-gray-800 text-3xl font-bold">{analytics.savedQuestions || 0}</p>
                  </div>
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Highest Score</p>
                    <p className="text-gray-800 text-3xl font-bold">{analytics.highestScore || 'N/A'}</p>
                  </div>
                  <div className="bg-violet-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-10 text-center mb-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 mx-auto mb-4 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 text-lg font-medium">No data available yet. Complete your first interview to see analytics.</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 px-4 flex items-center">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 h-6 w-1.5 rounded-full inline-block mr-3"></span>
              Quick Actions
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                to="/interview"
                className="relative bg-white rounded-xl shadow-lg overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                <div className="p-6 relative z-20">
                  <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-xl inline-block mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 group-hover:text-white transition-colors duration-300 mb-1">Start Interview</h3>
                  <p className="text-gray-500 group-hover:text-white/90 transition-colors duration-300">Practice with realistic scenarios</p>
                </div>
              </Link>
              
              <Link
                to="/saved"
                className="relative bg-white rounded-xl shadow-lg overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                <div className="p-6 relative z-20">
                  <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-3 rounded-xl inline-block mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 group-hover:text-white transition-colors duration-300 mb-1">Saved Questions</h3>
                  <p className="text-gray-500 group-hover:text-white/90 transition-colors duration-300">Review your collection</p>
                </div>
              </Link>
              
              <Link
                to="/analytics"
                className="relative bg-white rounded-xl shadow-lg overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                <div className="p-6 relative z-20">
                  <div className="bg-gradient-to-r from-blue-100 to-violet-100 p-3 rounded-xl inline-block mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 group-hover:text-white transition-colors duration-300 mb-1">Analytics</h3>
                  <p className="text-gray-500 group-hover:text-white/90 transition-colors duration-300">Track your progress</p>
                </div>
              </Link>
            </div>
          </div>
        </>
      ) : (
        // Guest view
        <div className="py-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">Master Your Interview Skills</h1>
            <p className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto">
              Get personalized AI-powered interview practice, real-time feedback, and analytics to help you land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition duration-200 transform hover:-translate-y-1"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="bg-white border-2 border-indigo-100 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-medium text-lg shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-1"
              >
                Sign In
              </Link>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform transition-all hover:shadow-xl">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Practice Anytime</h3>
              <p className="text-gray-600">Schedule interviews at your convenience and practice at your own pace.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform transition-all hover:shadow-xl">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600">Get detailed feedback and actionable tips to improve your interview responses.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform transition-all hover:shadow-xl">
              <div className="bg-gradient-to-br from-blue-100 to-violet-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Track Progress</h3>
              <p className="text-gray-600">Monitor your improvement with detailed analytics and performance metrics.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;