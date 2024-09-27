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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Bot, Tent, User } from 'lucide-react';
import Confetti from "react-confetti";
import React, { useEffect, useState } from 'react'
import { getAccessToken } from './utils/auth';

const DashboardCards = () => {
    const [balance, setBalance] = useState(null); 
  const [currency, setCurrency] = useState("KES"); 
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [analyticsData, setAnalyticsData] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [phone, setPhone] = useState('');
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
    
      // Analytics
      useEffect(() => {
        const fetchAnalyticsData = async () => {
          try {
            const response = await axios.get(
              "https://api.waterhub.africa/api/v1/client/stats",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );
    
            console.log("Analytics API response:", response.data);
            setAnalyticsData(response.data); 
          } catch (error) {
            console.error("Error fetching analytics data:", error);
          }
        };
    
        if (token) {
          fetchAnalyticsData();
        }
      }, [token]);
    
    
      const handleWithdraw = async () => {
        try {
          const response = await axios.post(
            'https://api.waterhub.africa/api/v1/client/wallet/withdraw',
            {
              phone,
              amount: parseInt(withdrawAmount, 10),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
          );
    
          if (response.data.message === 'Success') {
            alert('Withdrawal successful!');
            // Show confetti for 3 seconds
            setShowConfetti(true);
            setTimeout(() => {
              setShowConfetti(false);
            }, 3000); // Confetti lasts for 3 seconds
          } else {
            alert('Withdrawal failed: ' + response.data.error);
          }
        } catch (error) {
          console.error('Error processing withdrawal:', error);
          alert('Error processing withdrawal. Please try again.');
        }
      };
     
  return (
    <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-2 mx-auto'>
        {analyticsData ? (
            <>
              <Card className="bg-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800  flex items-center justify-between w-full">
                    <h1>Devices</h1>
                    <Bot className="h-4 w-4 text-gray-800 mr-2 font-bold " />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    <CountUp end={parseInt(analyticsData.total_devices, 10)} duration={2.5} />
                  </div>
                  <p className="text-xs text-gray-700">Devices connected</p>
                </CardContent>
              </Card>

              <Card className="bg-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800  flex items-center justify-between w-full">
                    <h1>Sites</h1>
                    
                    <Tent className="h-4 w-4 text-gray-800 mr-2 font-bold " />
                    
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    <CountUp end={parseInt(analyticsData.total_sites, 10)} duration={2.5} />
                  </div>
                  <p className="text-xs text-gray-700">Sites registered</p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800  flex items-center justify-between w-full">
                    <h1>Customers</h1>
                    
                    <User className="h-4 w-4 text-gray-800 mr-2 font-bold " />
                    
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    <CountUp end={parseInt(analyticsData.total_customers, 10)} duration={2.5} />
                  </div>
                  <p className="text-xs text-gray-700">Customers served</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <div></div>
          )}

        <Card className="bg-blue-200 p-4">
          <h1 className="text-gray-800">Wallet balance</h1>
          {balance !== null ? (
            <div className="text-2xl font-bold text-blue-700 gap-4">
              <CountUp end={parseInt(balance, 10)} duration={2.5} /> {currency}

              {showConfetti && <Confetti width={300} height={200} />}
              
            </div>
          ) : (
            <p>0 {currency}</p>
          )}

          <div className='flex justify-end'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Withdraw</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cash Withdrawals to Mpesa</DialogTitle>
                <DialogDescription>
                  Withdrawal request will be sent to Approver: No approver registered, <span className='text-blue-500 underline'>Register</span>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount(KES)
                  </Label>
                  <Input id="amount"
                        placeholder="Enter amount"
                        className="col-span-3"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone No:
                  </Label>
                  <Input
                        id="phone"
                        placeholder="Enter number"
                        className="col-span-3"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                </div>
              </div>
              <DialogFooter>
                <Button className="bg-blue-500 text-white" type="submit" onClick={handleWithdraw}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </Card>

    </div>
  )
}

export default DashboardCards