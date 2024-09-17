'use client';

import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Spinner from '@/components/Spinner';

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
        console.log('User signed up successfully:', user);
        setEmail('');
        setPassword('');
        router.push('/sign-in');
      }
    } catch (error) {
      setError('Failed to sign up. Please check your email and password.');
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (<Spinner/>) :(
        <Card className="mx-auto max-w-sm">

        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome New User </CardTitle>
          <CardDescription>
            Enter your email below to sign up
          </CardDescription>
        </CardHeader>

        <CardContent>
        <div className="grid gap-4">
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
        {createUserError && <p className="text-red-500 mb-4">{createUserError.message}</p>}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm text-blue-500">
                Forgot your password?
              </Link>
            </div>
            <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required />
          </div>
          <Button type="submit"  onClick={handleSignUp} 
          disabled={loading} className="w-full bg-blue-500 rounded text-white hover:bg-blue-500">
            Sign In
          </Button>
          
        </div>
        <div className="mt-4 text-center text-sm">
         Already have an account?{" "}
          <Link href="/sign-in" className="underline text-blue-500">
            Sign In
          </Link>
        </div>
        </CardContent>


      </Card>
      )}
      
      
    </div>
  );
};

export default SignUp;



