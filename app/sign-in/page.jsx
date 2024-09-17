'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider'; 
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
import Spinner from '@/components/Spinner'; // Assuming you created this spinner

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await fetch("https://api.waterhub.africa/api/v1/client/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (response.ok && result.access_token) {
        console.log(`Access Token: ${result.access_token}`);
        localStorage.setItem('accessToken', result.access_token); 
        
        
        sessionStorage.setItem('user', JSON.stringify(result.data));
  
        login(result.data); 
        setEmail('');
        setPassword('');
        router.push('/dashboard'); 
      } else {
        setError(result.message || 'Failed to sign in. Please check your email and password.');
      }
    } catch (error) {
      setError('Failed to sign in. Please check your email and password.');
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <Spinner /> 
      ) : (
        <Card className="mx-auto max-w-sm">

        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back !</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
        <div className="grid gap-4">
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
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
            onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" onClick={handleSignIn} disabled={loading} className="w-full bg-blue-500 rounded text-white hover:bg-blue-500">
            Sign In
          </Button>
          
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline text-blue-500">
            Sign up
          </Link>
        </div>
        </CardContent>


        </Card>
      )}
    </div>
  );
};

export default SignIn;



