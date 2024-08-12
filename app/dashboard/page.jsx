'use client';

import Sidebar from '@/components/Sidebar';
import Mainbar from '@/components/Mainbar';
import ProtectedRoute from '@/components/ProtectedRoute';

const Dashboard = () => {
  
  return (
    <ProtectedRoute>
      <div className=' flex min-h-screen w-full flex-col gap-3 px-2 py-4'>
      <Sidebar />
      <Mainbar/>
    </div>

    </ProtectedRoute>
    
  );
};

export default Dashboard;
