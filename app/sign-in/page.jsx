'use client';

import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signInWithEmailAndPassword, userCredential, loading, errorFirebase] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // Attempt to sign in the user
      const result = await signInWithEmailAndPassword(email, password);

      // Check if the sign-in was successful
      if (result.user) {
        // Log the user's email to the console with a success message
        console.log(`${result.user.email} successfully logged in`);

        // Store the user data in session storage
        sessionStorage.setItem('user', JSON.stringify(result.user));
        setEmail('');
        setPassword('');
        
        // Redirect to the dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2500);
      } else {
        // Handle cases where sign-in is unsuccessful
        setError('Failed to sign in. Please check your email and password.');
      }
    } catch (error) {
      // Handle and display any error that occurs during the sign-in process
      setError('Failed to sign in. Please check your email and password.');
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
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
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
          disabled={loading} // Disable the button while loading
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
