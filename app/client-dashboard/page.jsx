'use client';
import CountUp from 'react-countup';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';
import Mainbar from '@/components/Mainbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { cards, users } from '@/data';
import Useravatar from '@/components/Useravatar';
import { Stackedchart } from '@/components/Stackedchart';
import Link from 'next/link';
import { FiArrowUpRight } from "react-icons/fi";
import { getAccessToken } from '@/components/utils/auth';
import { useEffect, useState } from 'react';


const Page = () => {

  const [balance, setBalance] = useState(null); 
  const [currency, setCurrency] = useState("KES"); 
  const token = getAccessToken(); 

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await axios.get(
          "https://api.waterhub.africa/api/v1/client/wallet/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        
        console.log("API response:", response.data);

      
        if (response.data.message === "Success") {
          setBalance(response.data.data); 
          setCurrency("KES"); 
        } else {
          setBalance(0); 
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error); 
        setBalance(0); 
      } 
    };

    if (token) {
      fetchWalletBalance();
    }
  }, [token]);


  return (
    // <ProtectedRoute>
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
      <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-2 mx-auto'>
        {cards.map(card => (
          <Card key={card.id} x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between w-full">
                {card.name}
                <card.icon className="h-4 w-4 text-muted-foreground mr-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                <CountUp end={parseInt(card.stats, 10)} duration={2.5} />
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-blue-50 p-4">
          <h1 className="text-gray-800">Wallet balance</h1>
          {balance !== null ? (
            <div className="text-2xl font-bold text-blue-700 gap-4">
              <CountUp end={parseInt(balance, 10)} duration={2.5} /> {currency}
              
            </div>
          ) : (
            <p>0 {currency}</p>
          )}

          <div className='flex justify-end'>
          <Button>Withdraw</Button>
          </div>
        </Card>


          
      </div>

      <div className='mt-12 flex flex-col md:flex-row gap-6 p-2'>
        {/* Charts */}
        <div className="lg:w-2/5">
          <Stackedchart />
        </div>

        {/* Table for transaction */}
        <div className="lg:w-3/5">
          <div className="">
            <Button className="ml-auto gap-1 mb-2 bg-blue-500 px-6 py-2 flex flex-row items-center text-white">
              <Link href="#" className="flex flex-row items-center">
                View All
                <FiArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <Card>
            <Table>
              <TableCaption>A list of your recent transactions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className={['Pending', 'Failed'].includes(user.status) ? 'text-red-500' : ''}>
                      {user.status}
                    </TableCell>
                    <TableCell className="text-right">{user.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
     
    </div>

    // </ProtectedRoute>
    
  );
};

export default Page;
