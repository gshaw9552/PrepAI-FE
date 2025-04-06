// src/pages/auth/Register.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';

// Zod schema for registration
const registerSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validate inputs in real time
  useEffect(() => {
    const result = registerSchema.safeParse({ username, email, password, confirmPassword });
    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
    }
  }, [username, email, password, confirmPassword]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse({ username, email, password, confirmPassword });
    if (!result.success) {
      setError('Please fix the errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
        confirmPassword,
      });

      // After successful registration, navigate to login page
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-700 px-6 py-8 text-white">
          <h2 className="text-3xl font-bold text-center">Create an Account</h2>
          <p className="text-center mt-2 text-purple-100">Join to practice your interview skills</p>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  className="border border-gray-300 rounded-md pl-10 pr-3 py-2 w-full focus:ring-purple-500 focus:border-purple-500 transition-all"
                  type="text"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {fieldErrors.username && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  className="border border-gray-300 rounded-md pl-10 pr-3 py-2 w-full focus:ring-purple-500 focus:border-purple-500 transition-all"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  className="border border-gray-300 rounded-md pl-10 pr-3 py-2 w-full focus:ring-purple-500 focus:border-purple-500 transition-all"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  className="border border-gray-300 rounded-md pl-10 pr-3 py-2 w-full focus:ring-purple-500 focus:border-purple-500 transition-all"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>
            
            <button 
              className={`w-full bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-700 text-white py-2 px-4 rounded-md font-medium ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-800 hover:via-violet-700 hover:to-indigo-800'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md transition-all duration-200`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Register'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium transition-all hover:translate-y-[-1px] inline-block">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;