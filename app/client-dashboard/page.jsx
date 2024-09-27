'use client';


import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';

import ProtectedRoute from '@/components/ProtectedRoute';

import Useravatar from '@/components/Useravatar';


import Clientchart from '@/components/Clientchart';

import DashboardCards from '@/components/DashboardCards';
import DashboardTable from '@/components/DashboardTable';


const Page = () => {
  

  return (
    <ProtectedRoute>
      <div className=' flex min-h-screen w-full flex-col gap-3 px-2 py-4'>
      <Sidebar />

      <div className=' w-11/12 mx-auto px-8 py-2'>
      <div className=' '>

        <Useravatar/>
        
        <p className='mt-2 tracking-wider text-sm font-light text-black dark:text-white'>
          The following are insights of progress
        </p>

        
      </div>

      {/* Cards */}
      <div >

        <DashboardCards/>
          
      </div>

      <div className='mt-12 flex flex-col md:flex-row gap-6 p-2 mx-auto'>
        {/* Charts */}
        <div className="lg:w-2/4">
          <Clientchart/>
        </div>

        {/* Table for transaction */}
        <div className="lg:w-1/2">
          {/* <DashboardTable/>
           */}
        </div>


      </div>
    </div>
     
    </div>

   </ProtectedRoute>
    
  );
};

export default Page;
