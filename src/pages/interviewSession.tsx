// src/pages/interviewSession.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QUESTION_COUNT = 3;
const QUESTION_TIME = 600; // 10 minutes per question

const preloadedTopics = [
  "System Design",
  "Data Structures",
  "Algorithms",
  "Behavioral",
  "DevOps",
  "Frontend Development",
  "Backend Development"
];

const InterviewSession: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Candidate";
  const token = localStorage.getItem("token");
  
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [overallFeedback, setOverallFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME);
  const [savedQuestions, setSavedQuestions] = useState<Set<number>>(new Set());
  const [customTopic, setCustomTopic] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const formattedTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Check if there's an active interview
    if (localStorage.getItem("interviewActive") === "true") {
      // Ideally you would retrieve the stored state from localStorage or backend
      // This is a placeholder for that functionality
      setError("You have an unfinished interview. Please complete or cancel it.");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (currentQuestionIndex !== -1) {
      localStorage.setItem("interviewActive", "true");
      setProgress(((currentQuestionIndex + 1) / QUESTION_COUNT) * 100);
    }
  }, [currentQuestionIndex]);

  const startTimer = () => {
    setTimeLeft(QUESTION_TIME);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmitAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // const generateQuestion = async (prompt: string): Promise<string> => {
  //   try {
  //     const response = await axios.post('/api/interview/generate', { prompt }, { 
  //       headers: { Authorization: `Bearer ${token}` } 
  //     });
  //     return response.data.question;
  //   } catch (err) {
  //     console.error("Error generating questions:", err);
  //     throw err;
  //   }
  // };

  const startInterview = async () => {
    setError('');
    const selectedTopic = topic || customTopic;
    
    if (!selectedTopic.trim()) {
      setError("Please select or enter an interview topic.");
      return;
    }
    
    setIsLoading(true);
    try {
      const prompt = `Generate 3 challenging interview questions on "${selectedTopic}" for a candidate with moderate experience. Format them as: Q1: <question1> || Q2: <question2> || Q3: <question3>`;
      
      const response = await axios.post('/api/interview/generate', { prompt }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      const allQuestionsText: string = response.data.question;
      const qs = allQuestionsText.split("||").map(q => q.replace(/Q\d+:\s*/, '').trim());
      
      if (qs.length !== QUESTION_COUNT) {
        throw new Error("Expected 3 questions, but received a different count.");
      }
      
      setQuestions(qs);
      setCurrentQuestionIndex(0);
      setAnswers(Array(QUESTION_COUNT).fill(''));
      setFeedbacks(Array(QUESTION_COUNT).fill({ text: '' }));
      setSavedQuestions(new Set());
      startTimer();
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Error generating questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const evaluateAnswer = async (currentQ: string, candidateAnswer: string): Promise<any> => {
    const response = await axios.post('https://prepai-ww7l.onrender.com/api/interview/evaluate', 
      { question: currentQ, answer: candidateAnswer }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.feedback;
  };

  const handleSubmitAnswer = async (autoSubmit: boolean = false) => {
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    const candidateAnswer = autoSubmit 
      ? (answers[currentQuestionIndex] || "No answer provided (time expired)") 
      : answers[currentQuestionIndex];
    
    setIsLoading(true);
    try {
      const fb = await evaluateAnswer(questions[currentQuestionIndex], candidateAnswer);
      setFeedbacks(prev => {
        const newFb = [...prev];
        newFb[currentQuestionIndex] = fb;
        return newFb;
      });
      
      if (currentQuestionIndex < QUESTION_COUNT - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        startTimer();
      } else {
        if (answers.some(ans => ans.trim() === "")) {
          if (!window.confirm("Some questions are unanswered. End interview anyway?")) {
            startTimer();
            setIsLoading(false);
            return;
          }
        }
        await generateOverallFeedback();
        await storeInterviewSession();
        setCurrentQuestionIndex(QUESTION_COUNT);
        localStorage.removeItem("interviewActive");
      }
    } catch (err) {
      console.error("Error evaluating answer:", err);
      setError("Error evaluating answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateOverallFeedback = async () => {
    try {
      const combinedQA = questions.map((q, i) =>
        `Q${i+1}: ${q}\nA${i+1}: ${answers[i] || "(no answer)"}\nFeedback: ${feedbacks[i]?.text || ""}`
      ).join("\n\n");
      
      const prompt = `Based on the following details, provide overall feedback and recommendations:\n\n${combinedQA}`;
      
      const response = await axios.post('/api/interview/evaluate', 
        { question: combinedQA, answer: prompt }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOverallFeedback(response.data.feedback);
    } catch (err) {
      console.error("Error generating overall feedback:", err);
      setOverallFeedback("Could not generate overall feedback.");
    }
  };

  const storeInterviewSession = async () => {
    try {
      await axios.post(
        '/api/interview/store',
        { 
          topic: topic || customTopic,
          questions, 
          answers, 
          feedbacks, 
          overallFeedback 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error storing interview session:", err);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAns = [...answers];
    newAns[currentQuestionIndex] = e.target.value;
    setAnswers(newAns);
  };

  const handleEndInterview = () => {
    if (answers.some(ans => ans.trim() === "")) {
      if (!window.confirm("Some questions are unanswered. End interview and skip them?")) return;
    } else {
      if (!window.confirm("Are you sure you want to end the interview?")) return;
    }
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsLoading(true);
    Promise.all([
      generateOverallFeedback(),
      storeInterviewSession()
    ]).then(() => {
      setCurrentQuestionIndex(QUESTION_COUNT);
      localStorage.removeItem("interviewActive");
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const handleRetry = () => {
    setTopic('');
    setCustomTopic('');
    setQuestions([]);
    setCurrentQuestionIndex(-1);
    setAnswers([]);
    setFeedbacks([]);
    setOverallFeedback('');
    setError('');
    setSavedQuestions(new Set());
    
    if (timerRef.current) clearInterval(timerRef.current);
    localStorage.removeItem("interviewActive");
  };

  const handleSaveQuestion = () => {
    setSavedQuestions(prev => new Set([...prev, currentQuestionIndex]));
    
    // Also save to backend
    try {
      axios.post(
        '/api/saved',
        { 
          question: questions[currentQuestionIndex],
          answer: answers[currentQuestionIndex] || "" 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error saving question:", err);
      // We keep it in the local set anyway
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Interview Session for <span className="text-blue-600">{username}</span>
          </h1>
          
          {currentQuestionIndex !== -1 && currentQuestionIndex < QUESTION_COUNT && (
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">{formattedTime()}</span>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {currentQuestionIndex === -1 && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Interview Topic</h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {preloadedTopics.map(t => (
                <button 
                  key={t} 
                  className={`px-4 py-2 rounded-md transition ${
                    topic === t 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                  onClick={() => {
                    setTopic(t);
                    setCustomTopic('');
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customTopic">
                Or enter a custom topic:
              </label>
              <input 
                id="customTopic"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                type="text" 
                placeholder="E.g., React Hooks, Python Django, Machine Learning..."
                value={customTopic} 
                onChange={e => {
                  setCustomTopic(e.target.value);
                  setTopic('');
                }} 
              />
            </div>
            
            <button 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white p-3 rounded-md w-full shadow-md transition flex items-center justify-center"
              onClick={startInterview} 
              disabled={isLoading || (!topic && !customTopic)}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Questions...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Interview
                </>
              )}
            </button>
          </div>
        )}
        
        {currentQuestionIndex !== -1 && currentQuestionIndex < QUESTION_COUNT && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Question {currentQuestionIndex + 1} of {QUESTION_COUNT}
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                Topic: {topic || customTopic}
              </span>
            </div>
            
            <div className="relative p-6 bg-gray-50 border border-gray-200 rounded-lg mb-6">
              <button
                className={`absolute -top-3 -right-3 text-xs px-3 py-1.5 rounded-full shadow z-10 flex items-center ${
                  savedQuestions.has(currentQuestionIndex)
                    ? 'bg-yellow-400 text-yellow-800'
                    : 'bg-yellow-300 hover:bg-yellow-400 text-gray-800'
                }`}
                onClick={handleSaveQuestion}
                disabled={savedQuestions.has(currentQuestionIndex)}
              >
                {savedQuestions.has(currentQuestionIndex) ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save
                  </>
                )}
              </button>
              <p className="text-lg text-gray-800">{questions[currentQuestionIndex]}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="answer">
                Your Answer:
              </label>
              <textarea
                id="answer"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48 resize-y"
                placeholder="Type your answer here..."
                value={answers[currentQuestionIndex] || ""}
                onChange={handleAnswerChange}
              />
            </div>
            
            <div className="flex justify-between gap-4">
              <button 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-md shadow-md transition flex-1 flex items-center justify-center"
                onClick={() => handleSubmitAnswer()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Answer
                  </>
                )}
              </button>
              
              <button 
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-md shadow-md transition flex-1 flex items-center justify-center"
                onClick={handleEndInterview}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                End Interview
              </button>
            </div>
          </div>
        )}
        
        {feedbacks[currentQuestionIndex]?.text && currentQuestionIndex < QUESTION_COUNT && (
          <div className="mt-6 p-6 bg-green-50 border border-green-100 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Feedback on Question {currentQuestionIndex + 1}</h3>
              {feedbacks[currentQuestionIndex].score !== undefined && (
                <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Score: {feedbacks[currentQuestionIndex].score}/10
                </span>
              )}
            </div>
            <p className="text-gray-700 whitespace-pre-line">{feedbacks[currentQuestionIndex].text}</p>
          </div>
        )}
        
        {currentQuestionIndex === QUESTION_COUNT && (
          <div className="mt-6 p-6 bg-blue-50 border border-blue-100 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Interview Complete</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Overall Feedback</h3>
              <p className="text-gray-700 whitespace-pre-line">{overallFeedback || "No overall feedback provided."}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Question Summary</h3>
              {questions.map((q, i) => (
                <div key={i} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">Question {i + 1}</h4>
                    {savedQuestions.has(i) && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                        Saved
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{q}</p>
                  <p className="text-sm text-gray-500">Your answer: {answers[i] || "(No answer provided)"}</p>
                  
                  {feedbacks[i]?.text && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Feedback:</span> {feedbacks[i].text}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md shadow-md transition flex-1 flex items-center justify-center"
                onClick={handleRetry}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Interview
              </button>
              
              <button 
                className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-md shadow-md transition flex-1 flex items-center justify-center"
                onClick={() => navigate('/dashboard')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;