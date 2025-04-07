'use client';
import CountUp from 'react-countup';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Bot, Tent, User } from 'lucide-react';
import Confetti from "react-confetti"
import React, { useEffect, useState } from 'react'
import { getAccessToken } from './utils/auth';
import Link from 'next/link';

const DashboardCards = () => {
    const [balance, setBalance] = useState(null); 
     const [devices, setDevices] = useState([]);
  const [currency, setCurrency] = useState("KES"); 
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [analyticsData, setAnalyticsData] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [requesterPhone, setRequesterPhone] = useState(" ");
    const [remarks, setRemarks] = useState("");
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);  
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [billingFormData, setBillingFormData] = useState({
      bankName: '',
      bankAccount: '',
      mpesaNumber: '',
      approverName: '',
      approverEmail: '',
      approverContact: '',
    });
    const token = getAccessToken();

    const handleSelectChange = (value) => {
      const device = devices.find((d) => d.device_serial === value);
      setSelectedDevice(device);
    };

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
    
            
            // console.log("Wallet balance:", response.data.data);
    
          
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


      useEffect(() => {
        if (!token) return;
    
        const fetchBillingDetails = async () => {
          try {
            const response = await axios.get(
              "https://api.waterhub.africa/api/v1/client/billing",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );
            const result = response.data;
            if (response.status === 200 && result.status === "Successful") {
              const { bank_name, account_number, bank_paybill, approver_name, approver_email, approver_phone } = result.data;
              setBillingFormData({
                bankName: bank_name || "",
                bankAccount: account_number || "",
                mpesaNumber: bank_paybill || "",
                approverName: approver_name || "",
                approverEmail: approver_email || "",
                approverContact: approver_phone || "",
              });
            } else {
              console.error("Failed to fetch billing details:", result.message);
            }
          } catch (error) {
            console.error("Error fetching billing details:", error);
          }
        };
    
        fetchBillingDetails();
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
    
            // console.log("Analytics API response:", response.data);
            setAnalyticsData(response.data); 
          } catch (error) {
            console.error("Error fetching analytics data:", error);
          }
        };
    
        if (token) {
          fetchAnalyticsData();
        }
      }, [token]);


      // Serial number
      useEffect(() => {
        const fetchDevices = async () => {
          try {
            const response = await axios.get("https://api.waterhub.africa/api/v1/client/wallets", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            });
            
            if (response.data.message === "Success") {
              setDevices(response.data.data); 
            }

            // consle.log("Device serials", response.data.data)
          } catch (error) {
            console.error("Error fetching devices:", error);
          }
        };
    
        if (token) {
          fetchDevices();
        }
      }, [token]);
    
      const handleWithdraw = async () => {
        try {
          const response = await axios.post(
            'https://api.waterhub.africa/api/v1/client/withdraw/initiate-request',
            {
              amount: parseInt(withdrawAmount, 10),
              requester: requesterPhone,
              account: billingFormData.bankAccount || "", 
              paybill: parseInt(billingFormData.mpesaNumber, 10) || 0,
              device: selectedDevice ? selectedDevice.device_id : "", 
              remarks: remarks,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
          );
          
          if (response.data.message === 'Success, withdrawal request initiated, await approval') {
            // console.log('Withdrawal request successful!');
            setRemarks("")
            setWithdrawAmount("")
            setRequesterPhone("")
            setWithdrawalSuccess(true);  
          } else {
            alert('Withdrawal failed: ' + response.data.error);
            setWithdrawalSuccess(false);  
          }
        } catch (error) {
          console.error('Error processing withdrawal:', error);
          alert('Error processing withdrawal. Please try again.');
          setWithdrawalSuccess(false);  
        }
      };
    
  return (
    <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4  mx-auto'>
      <>
      <Card className="bg-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-800 flex items-center justify-between w-full">
            <h1>Devices</h1>
            <Bot className="h-4 w-4 text-gray-800 mr-2 font-bold" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">
            <CountUp end={parseInt(analyticsData?.total_devices ?? 0, 10)} duration={2.5} />
          </div>
          <p className="text-xs text-gray-700">Devices connected</p>
        </CardContent>
      </Card>
    
      <Card className="bg-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-800 flex items-center justify-between w-full">
            <h1>Sites</h1>
            <Tent className="h-4 w-4 text-gray-800 mr-2 font-bold" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">
            <CountUp end={parseInt(analyticsData?.total_sites ?? 0, 10)} duration={2.5} />
          </div>
          <p className="text-xs text-gray-700">Sites registered</p>
        </CardContent>
      </Card>
    
      <Card className="bg-yellow-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-800 flex items-center justify-between w-full">
            <h1>Customers</h1>
            <User className="h-4 w-4 text-gray-800 mr-2 font-bold" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">
            <CountUp end={parseInt(analyticsData?.total_customers ?? 0, 10)} duration={2.5} />
          </div>
          <p className="text-xs text-gray-700">Customers served</p>
        </CardContent>
      </Card>
      </>
  

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
                <DialogContent className="sm:max-w-[600px] max-h-[500px] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Cash Withdrawals to Mpesa</DialogTitle>
                    <DialogDescription>
                      Withdrawal request will be sent to Approver: No approver registered, <span className='text-blue-500 underline'><Link href="/account">Register</Link></span>

                      <p className='mt-3 text-gray-800 dark:text-white font-medium'>
                        NB: Automatic funds transfer from the wallet to your Bank Account, will take place at the last day of the month. 
                        <span className='text-blue-500'> A monthly service fee of KES 150/= is deductible from wallet</span>
                        </p>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">Amount (KES)</Label>
                      <Input 
                      id="amount" placeholder="Enter amount" className="col-span-3" 
                      value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">Phone No:</Label>
                      <Input id="phone" placeholder="Enter number" className="col-span-3" 
                      value={requesterPhone}
                      onChange={(e) => setRequesterPhone(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="paybill" className="text-right">Paybill:</Label>
                      <Input id="paybill"
                       placeholder="Enter number" className="col-span-3" 
                       value={billingFormData.mpesaNumber} readOnly  />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="account" className="text-right">Account No:</Label>
                      <Input id="account"
                       placeholder="Enter number" className="col-span-3"
                        value={billingFormData.bankAccount} readOnly  />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="account" className="text-right">Device Serial:</Label>
                    <Select onValueChange={handleSelectChange}>
                      <SelectTrigger className="w-[390px]">
                        <SelectValue placeholder="Select a device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Device Serial</SelectLabel>
                          {devices.map((device) => (
                            <SelectItem key={device.device_id} value={device.device_serial}>
                              {device.device_serial} - {device.site}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    

                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount_available" className="text-right">
                    Wallet Balance:
                  </Label>
                  <Input
                        id="amount_available"
                        placeholder="Amount available"
                        className="col-span-3"
                        value={selectedDevice ? selectedDevice.balance : ""}
                        readOnly 
                      />
                    </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="remarks" className="text-right">Remarks:</Label>
                  <Textarea 
                   className="col-span-3"
                  placeholder="Type your message here." id="remarks"
                  value={remarks}
                      onChange={(e) => setRemarks(e.target.value)} />
                  </div>
                  </div>
                  <DialogFooter>
                    <Button className="bg-blue-500 text-white" type="submit" onClick={handleWithdraw}>Initiate Request</Button>
                  </DialogFooter>
                </DialogContent>
          </Dialog>
          {withdrawalSuccess && (
            <Dialog open={withdrawalSuccess} onOpenChange={() => setWithdrawalSuccess(false)}>
              <DialogContent className="sm:max-w-[400px] max-h-[300px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Withdrawal Request Awaiting Approval</DialogTitle>
                  <DialogDescription>
                    Your withdrawal request is now awaiting approval from the approver.
                    You will be notified once the request is approved.
                    {/* <p className="mt-3 text-gray-800 dark:text-white font-medium">
                      You will be notified once the request is approved.
                    </p> */}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  {/* <Button className="bg-blue-500 text-white" onClick={() => setWithdrawalSuccess(false)}>Close</Button> */}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          </div>
        </Card>

    </div>
  )
}

export default DashboardCards