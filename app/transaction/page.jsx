'use client'
import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";

import Useravatar from "@/components/Useravatar";

import  { TransactionsChart } from "@/components/TransactionsChart";
import Mpesa from "@/components/Mpesa";
import Tag from "@/components/Tag";
import Withdrawals from "@/components/Withdrawals";


const page = () => {

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Sidebar />
      <div className="p-4 flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Useravatar />

        <main className=" px-4 py-2 sm:px-6 sm:py-0 ">
        <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Transaction Reports.</h1>
          </div>

          <p className="mt-1 tracking-wider text-sm font-light ">
          Get transaction reports down below
          </p>
         

         

          <Tabs defaultValue="mpesa" className="w-full">
          <TabsList className="flex flex-row gap-5 w-[380px] my-5">
            <TabsTrigger value="mpesa">Mpesa</TabsTrigger>
            <TabsTrigger value="tag">Tag</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawal History</TabsTrigger>
            
          </TabsList>

          <TransactionsChart/>
          
        

         
          {/* Mpesa Transactions */}

          <TabsContent value="mpesa">
           <Mpesa/>
          </TabsContent>

          {/* Tag Transactions */}

          <TabsContent value="tag">
           <Tag/>
          </TabsContent>

          {/* Withdrwal Transactions */}
          <TabsContent value="withdrawal">

            <Withdrawals/>

            
          </TabsContent>

         
        </Tabs>

        </main>
        
        
        
      </div>
    </div>
  );
};

export default page;
