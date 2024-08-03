'use client';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { FiLogOut } from "react-icons/fi";
import Sidebar from '@/components/Sidebar';
import Mainbar from '@/components/Mainbar';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('user');
      setUserSession(session);
    }
  }, []);

  useEffect(() => {
    if (!user && !userSession) {
      router.push('/sign-in');
    }
  }, [user, userSession, router]);

  return (
    <main className='bg-gray-900 min-h-screen'>
      <div className='flex flex-col items-center justify-between sticky'>
        {/* Navigation bar */}
        <div className='flex flex-col md:flex-row py-2 w-full items-center space-y-2 bg-gray-700 shadow-2 justify-between px-4'>
          <div className='text-[18px] font-medium text-white'>Logo</div>
          <div className='flex flex-row gap-8 px-4 items-center justify-center lg:mr-8 text-white'>
            <div>
              Welcome Back, Ubuntu Africa
            </div>
            <div className='flex flex-row space-x-2 bg-blue px-4 py-2 rounded-md text-sm text-white bg-blue-500'>
              <FiLogOut size={20}/>
              <button className='' onClick={() => {
                signOut(auth);
                sessionStorage.removeItem('user');
                setUserSession(null);
              }}>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-row gap-2'>
        <Sidebar/>
        <Mainbar/>
      </div>
    </main>
  );
};

export default Dashboard;
