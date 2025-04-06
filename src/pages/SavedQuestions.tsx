// src/pages/SavedQuestions.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SavedItem {
  _id: string;
  question: string;
  answer: string;
  feedback?: { text: string; score?: number };
  createdAt: string;
}

const SavedQuestions: React.FC = () => {
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedAnswer, setEditedAnswer] = useState<string>('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'Candidate';

  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchSavedQuestions();
  }, [token, navigate]);

  const fetchSavedQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/saved', { headers: { Authorization: `Bearer ${token}` } });
      setSaved(response.data.saved);
      setError('');
    } catch (err) {
      console.error("Error fetching saved questions:", err);
      setError("Failed to load saved questions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (item: SavedItem) => {
    setEditingId(item._id);
    setEditedAnswer(item.answer);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedAnswer('');
  };

  const updateAnswer = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `/api/saved/${id}`, 
        { answer: editedAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state with new data
      setSaved(saved.map(item => 
        item._id === id ? { ...item, answer: editedAnswer, feedback: response.data.feedback } : item
      ));
      
      setEditingId(null);
      setError('');
    } catch (err) {
      console.error("Error updating answer:", err);
      setError("Failed to update answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this saved question?")) {
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.delete(`/api/saved/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSaved(saved.filter(item => item._id !== id));
      setError('');
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Saved Questions for <span className="text-blue-600">{username}</span>
          </h1>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
            onClick={fetchSavedQuestions}
            disabled={isLoading}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </div>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {isLoading && saved.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="mt-4 text-lg text-gray-600">Loading saved questions...</p>
          </div>
        ) : saved.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-lg text-gray-600">No saved questions yet.</p>
            <button
              onClick={() => navigate('/interview')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow transition"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {saved.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Question</h3>
                    <span className="text-sm text-gray-500">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-gray-700">{item.question}</p>
                </div>
                
                <div className="bg-white px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Answer</h3>
                  
                  {editingId === item._id ? (
                    <>
                      <textarea
                        className="border border-gray-300 p-3 rounded-md w-full mt-2 min-h-32"
                        placeholder="Type your answer here..."
                        value={editedAnswer}
                        onChange={(e) => setEditedAnswer(e.target.value)}
                      />
                      <div className="flex space-x-3 mt-3">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition flex-1"
                          onClick={() => updateAnswer(item._id)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Updating..." : "Save & Get Feedback"}
                        </button>
                        <button
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md shadow transition"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-200 min-h-32">
                        {item.answer || "(No answer provided)"}
                      </p>
                      <div className="flex space-x-3 mt-3">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition flex-1"
                          onClick={() => startEditing(item)}
                        >
                          Edit Answer
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
                          onClick={() => deleteQuestion(item._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
                {item.feedback && (
                  <div className="bg-green-50 px-6 py-4 border-t border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-green-800">Feedback</h3>
                      {item.feedback.score !== undefined && (
                        <span className="bg-green-600 text-white rounded-full px-4 py-1 text-sm font-medium">
                          Score: {item.feedback.score}
                        </span>
                      )}
                    </div>
                    <p className="text-green-700 whitespace-pre-wrap">{item.feedback.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedQuestions;