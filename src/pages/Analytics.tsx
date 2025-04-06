// src/pages/Analytics.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface InterviewData {
  createdAt: string;
  overallScore: number;
  overallFeedback: string;
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('https://prepai-ww7l.onrender.com/api/analytics', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setAnalytics(res.data);
          setInterviews(res.data.interviews || []);
        })
        .catch((err) => console.error("Error fetching analytics:", err));
    }
  }, [token]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Interview Analytics</h1>
      {analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-500 text-sm">Completed Interviews</p>
            <p className="text-2xl font-bold">{analytics.completedInterviews || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-500 text-sm">Average Score</p>
            <p className="text-2xl font-bold">{analytics.averageScore || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-500 text-sm">Highest Score</p>
            <p className="text-2xl font-bold">{analytics.highestScore || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center md:col-span-3">
            <p className="text-gray-500 text-sm">Saved Questions</p>
            <p className="text-2xl font-bold">{analytics.savedQuestions || 0}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading analytics...</p>
      )}      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Interview Sessions</h2>
        {interviews.length > 0 ? (
          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Score</th>
                <th className="border p-2">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((intv, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{new Date(intv.createdAt).toLocaleDateString()}</td>
                  <td className="border p-2">{intv.overallScore}%</td>
                  <td className="border p-2">{intv.overallFeedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No interview sessions recorded.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
