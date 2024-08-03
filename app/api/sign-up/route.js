// app/api/sign-up/route.js
import { auth } from '@/app/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export async function POST(req) {
  const { email, password } = await req.json();
  console.log('Request received')

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return new Response(JSON.stringify({ user: userCredential.user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
