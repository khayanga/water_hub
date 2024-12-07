"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Useravatar from "@/components/Useravatar";
import { getAccessToken } from "@/components/utils/auth";
import { useRouter } from "next/router";

export default async function Page({ params }) {

    const [amount, setAmount] = useState('');
  const { tagId } = params;
  const [tagData, settagData] = useState(null);
  const [error, setError] = useState('');
  const token = getAccessToken();

  useEffect(() => {
    if (tagId) {
      const fetchTag = async () => {
        try {
          const response = await fetch(`https://api.waterhub.africa/api/v1/client/tag/${tagId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log('Fetched tag data:', data);
            settagData(data.tag);
          } else {
            console.error('Error response:', response);
            setError('Failed to fetch tag details');
          }
        } catch (error) {
          console.error('Error fetching tag details:', error);
          setError('An error occurred while fetching tag details.');
        }
      };

      fetchTag();
    }
  }, [tagId, token]);

  const assignToken = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message

    try {
      const response = await fetch(`https://api.waterhub.africa/api/v1/client/tag/tokens/assign/${tagId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ amount: parseInt(amount, 10) }),
      });

      if (response.ok) {
        // alert('Token assigned successfully');
        toast({
          description: "Token assigned successfully.",
        });
      } else {
        toast({
          variant:"destructive",
          description: "Failed to assign token.",
        });
        setError('Failed to assign token');
      }
    } catch (error) {
      setError('An error occurred while assigning token.');
    }
};

  return (
    <div className="w-11/12 mx-auto">
      <Sidebar />

      <div className="p-4 w-full mx-auto ">
        <div className="flex flex-row justify-between p-2 w-full">
          <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Tag Management</h1>
          </div>
          <div>
            <Useravatar />
          </div>
        </div>

        <p className="mt-1 tracking-wider text-sm font-light pl-2">
          Make changes to your tags down below
        </p>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="flex flex-row gap-3 w-[200px] my-5 ">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="token_assign">Token Assign</TabsTrigger>
            
          </TabsList>

          {/* About dialog */}
          <TabsContent value="about">
            <Card className="w-[400px] py-2">
                <CardContent>
                <p>< span className="text-sm tracking-wide ">Tag Id:</span> {tagData?.tag_id ?? 'N/A'}</p>
                <p>< span className="text-sm tracking-wide ">Customer Name:</span> {tagData?.customer.customer_name ?? 'N/A'}</p>
                <p>< span className="text-sm tracking-wide ">Token Balance :</span> {tagData?.token_balance ?? 'N/A'}</p>
                <p>< span className="text-sm tracking-wide ">Device serial number:</span> {tagData?.device ?? 'N/A'}</p>
                
                </CardContent>
            </Card>
          </TabsContent>

          <form onSubmit={assignToken} className="max-w-sm mt-5 ">
            <TabsContent value="token_assign">
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="token">Amount(KES)</Label>
                      <Input
                        id="token"
                        type="text"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        
                      />
                    </div>
                    
                  </div>

                  
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-blue-500 text-white">
                    Assign Token
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
          </form>
          
         

         
          

          

          
        </Tabs>
      </div>
    </div>
  );
};

