"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
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

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Useravatar from "@/components/Useravatar";
import { getAccessToken } from "@/components/utils/auth";


const page = () => {

  const [transactions, setTransactions] = useState([]);

  const token= getAccessToken();


  
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
        console.log("API Response Data:", data); // Log the entire response to understand its structure

        if (data && data.device_transactions) {
          setTransactions(data.device_transactions); // Correctly map if `device_transactions` exists
          console.log("Fetched Transactions:", data.device_transactions);
        } else {
          console.error("Unexpected response structure", data); // Handle unexpected response structure
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
            <TabsTrigger value="tap_top_up">Tap Top up</TabsTrigger>
            
          </TabsList>

          {/* Mpesa dialog */}
          <TabsContent value="mpesa">
          <div className="w-full mt-2">
          <Card className="ml-4">
            <Table>
              <TableCaption>Mpesa Transactions</TableCaption>
              <TableHeader>
                <TableRow>
                <TableHead>Device serial</TableHead>
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
                    <TableCell>{transaction.device.device_serial}</TableCell>
                    <TableCell>{transaction.mobile_no}</TableCell>
                    <TableCell>{transaction.transaction_code}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.tap_no}</TableCell>
                    <TableCell>{transaction.status}</TableCell>
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
