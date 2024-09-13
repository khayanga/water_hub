"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import Useravatar from "@/components/Useravatar";
import { CalendarIcon } from "@radix-ui/react-icons"
import { getAccessToken } from "@/components/utils/auth";


const page = () => {

  const [transactions, setTransactions] = useState([]);
  const [date, setDate] = useState(null);
  const [tagTransactions, setTagTransactions] = useState([]);

  const token= getAccessToken();


  // mpesa transactions 
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("https://api.waterhub.africa/api/v1/client/transactions/mpesa", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        const data = await response.json();
        console.log("API Response Data:", data); 

        if (data && data.device_transactions) {
          setTransactions(data.device_transactions); 
          console.log("Fetched Transactions:", data.device_transactions);
        } else {
          console.error("Unexpected response structure", data); 
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (token) {
      fetchTransactions();
    } else {
      console.error("Token is missing. Please ensure you are logged in.");
    }
  }, [token]);



  // Tag transactions
  useEffect(() => {
    const fetchTagTransactions = async () => {
      try {
        const response = await fetch("https://api.waterhub.africa/api/v1/client/transactions/tag?per_page=10", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        const data = await response.json();
        if (data && data.tag_pay_transactions) {
          setTagTransactions(data.tag_pay_transactions);
        } else {
          console.error("Unexpected response structure", data);
        }
      } catch (error) {
        console.error("Error fetching tag transactions:", error);
      }
    };

    if (token) {
      fetchTagTransactions();
    } else {
      console.error("Token is missing. Please ensure you are logged in.");
    }
  }, [token])
  
  
  return (
    <div className="w-11/12 mx-auto">
      <Sidebar />

      <div className="p-4 w-full mx-auto ">
        <div className="flex flex-row justify-between p-2 w-full">
          <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Tranasaction reports.</h1>
          </div>
          <div>
            <Useravatar />
          </div>
        </div>

        <p className="mt-1 tracking-wider text-sm font-light pl-2">
          Get transactions reports down below 
        </p>

        <Tabs defaultValue="mpesa" className="w-full">
          <TabsList className="flex flex-row gap-5 w-[370px] my-5 ">
            <TabsTrigger value="mpesa">Mpesa</TabsTrigger>
            <TabsTrigger value="tag">Tag </TabsTrigger>
            <TabsTrigger value="tag_pay">Tag Pay</TabsTrigger>
            <TabsTrigger value="tag_top_up">Tag Top up</TabsTrigger>
            
          </TabsList>

          {/* Mpesa transactions */}
          <TabsContent value="mpesa">
          <div className="w-full mt-2">
          <Card className="ml-4">
            <Table>
              <TableCaption>Mpesa Transactions</TableCaption>
              <TableHeader>
                <TableRow>
                {/* <TableHead>Device serial</TableHead> */}
                <TableHead>Mobile No</TableHead>
                <TableHead>Transaction code</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Tap No</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    {/* <TableCell>{transaction.device.device_serial}</TableCell> */}
                    <TableCell>{transaction.mobile_no}</TableCell>
                    <TableCell>{transaction.transaction_code}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.tap_no}</TableCell>
                    <TableCell><Badge variant="outline">{transaction.status}</Badge></TableCell>
                    <TableCell>{transaction.created_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          </div>
          </TabsContent>

          {/* Tag transactons */}

          <TabsContent value="tag">
          <div className="w-full mt-2">
          <Card className="ml-4">
            <Table>
              <TableCaption>Tag Transactions</TableCaption>
              <TableHeader>
                <TableRow>
                <TableHead>Tag ID</TableHead>
                <TableHead>Transaction code</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {tagTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.tag.tag_id}</TableCell>
                  <TableCell>{transaction.transaction_code}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell><Badge variant="outline">{transaction.status}</Badge></TableCell>
                  <TableCell>{transaction.created_at}</TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </Card>
          </div>
          </TabsContent>

        
        <TabsContent value="tag_pay">
        <div className="w-full mt-2">

          <div className="ml-5 space-x-3 flex  items-center " >
          <Popover >
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
            </Popover>

            <Button className="bg-blue-500 hover:bg-none px-6 py-1 text-white">Generate</Button>

          </div>

        <Card className="ml-4 mt-5">
          
          <Table>
            <TableCaption>Tag Transactions</TableCaption>
            <TableHeader>
              <TableRow>
              <TableHead>Tag ID</TableHead>
              <TableHead>Transaction code</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {tagTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.tag.tag_id}</TableCell>
                <TableCell>{transaction.transaction_code}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell><Badge variant="outline">{transaction.status}</Badge></TableCell>
                <TableCell>{transaction.created_at}</TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </Card>
        </div>
        </TabsContent>

          
        </Tabs>
      </div>
    </div>
  )
}

export default page
