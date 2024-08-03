'use client';

import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [createUserWithEmailAndPassword, user, loading, createUserError] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await createUserWithEmailAndPassword(email, password);
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        setEmail('');
        setPassword('');
        setTimeout(() => {
          router.push('/sign-in');
        }, 2500);
      }
    } catch (error) {
      setError('Failed to sign up. Please check your email and password.');
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
        {createUserError && <p className="text-red-500 mb-4">{createUserError.message}</p>}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button 
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default SignUp;

