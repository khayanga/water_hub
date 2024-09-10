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

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Useravatar from "@/components/Useravatar";
import { getAccessToken } from "@/components/utils/auth";
import { useRouter } from "next/router";

const Page = ({params}) => {
   
 
  const { deviceId } = params;
  const [deviceData, setDeviceData] = useState(null);
  const [error, setError] = useState('');
  const token = getAccessToken();

  useEffect(() => {
    if (deviceId) {
      const fetchDevice = async () => {
        try {
          const response = await fetch(`https://api.waterhub.africa/api/v1/client/device/${deviceId}`,
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
            console.log('Fetched device data:', data);
            setDeviceData(data.device);
          } else {
            console.error('Error response:', response);
            setError('Failed to fetch device details');
          }
        } catch (error) {
          console.error('Error fetching device details:', error);
          setError('An error occurred while fetching device details.');
        }
      };

      fetchDevice();
    }
  }, [deviceId, token]);

  return (
    <div className="w-11/12 mx-auto">
      <Sidebar />

      <div className="p-4 w-full mx-auto ">
        <div className="flex flex-row justify-between p-2 w-full">
          <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Device Management</h1>
          </div>
          <div>
            <Useravatar />
          </div>
        </div>

        <p className="mt-1 tracking-wider text-sm font-light pl-2">
          Make changes to your device down below
        </p>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="flex flex-row gap-3 w-[600px] my-5 ">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="tap-settings">Tap Settings</TabsTrigger>
            <TabsTrigger value="tap-callibration">Tap Callibration Settings</TabsTrigger>
          </TabsList>

          {/* About dialog */}
          <TabsContent value="about">
            <Card className="w-[350px] py-2">
                <CardContent>
                <p><strong>Serial Number:</strong> {deviceData?.device_serial ?? 'N/A'}</p>
                <p><strong>No of Taps:</strong> {deviceData?.no_of_tap ?? 'N/A'}</p>
                <p><strong>Client Name:</strong> {deviceData?.user?.client ?? 'N/A'}</p>
                <p><strong>Site Name:</strong> {deviceData?.site?.site_name ?? 'N/A'}</p>
                </CardContent>
            </Card>
          </TabsContent>
          {/* tags */}
          <form className="w-full mt-5 pl-2" >
            <TabsContent value="tags">
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="senderId">SMS Sender ID</Label>
                      <Input
                        id="senderId"
                        type="text"
                        placeholder="Enter sender id"
                        
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="apiKey">SMS API Key</Label>
                      <Input
                        id="apiKey"
                        type="text"
                        placeholder="Enter API key"
                        
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">SMS Email Account</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="sms@gmail.com"
                        
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="smsUrl">SMS URL</Label>
                      <Input
                        id="smsUrl"
                        type="url"
                       
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-blue-500 text-white">
                    Save
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

export default Page;