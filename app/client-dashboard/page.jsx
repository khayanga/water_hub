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
      <div className='flex min-h-screen w-full flex-col'>
      <Sidebar />

      <div className=' flex flex-col sm:gap-4 sm:py-4 sm:pl-14 '>
      <Useravatar/>
      <main className=" px-4 py-2 sm:px-6 sm:py-0  ">
      
        <p className=' my-2 tracking-wider text-sm font-light text-black dark:text-white'>
          The following are insights of progress
        </p>

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

      </main>

      
      </div>
     
    </div>

   </ProtectedRoute>
    
  );
};

export default Page;
