'use client';

import Sidebar from '@/components/Sidebar';
import Mainbar from '@/components/Mainbar';

const Dashboard = () => {
  
  return (
    <div className=' flex min-h-screen w-full flex-col gap-3 px-2 py-4'>
      <Sidebar />
      <Mainbar/>
    </div>
  );
};

export default Dashboard;
