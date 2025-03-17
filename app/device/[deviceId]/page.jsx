"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

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
import { useParams } from "next/navigation";
import Tapsettings from "@/components/Tapsettings";
import { useToast } from "@/hooks/use-toast";
import TapCallibration from "@/components/TapCallibration";

export default  function Page() {

  const {toast} = useToast();
  const { deviceId } = useParams();

  const [deviceData, setDeviceData] = useState(null);
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState('');
  const [apiKeysData, setApiKeysData] = useState({
    client_id: '', 
    consumer_secret: '',
    consumer_key: '',
    short_code: '',
    pass_key: '',
    account: '',
    mpesa_till: '',
    account_type: '',
  });

  
// Fetching device information
  useEffect(() => {
    const fetchDevice = async () => {
      if (!deviceId) return;
      const token = getAccessToken();

      try {
        const response = await fetch(
          `https://api.waterhub.africa/api/v1/client/device/${deviceId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDeviceData(data.device);
         
        } else {
          setError("Failed to fetch device details");
        }
      } catch (error) {
        setError("An error occurred while fetching device details.");
      }
    };

    fetchDevice();
  }, [deviceId]);

    const handleApiKeysInputChange = useCallback((e) => {
      const { id, value } = e.target;
      setApiKeysData((prevData) => ({ ...prevData, [id]: value }));
    }, []);

    const handleAccountTypeChange = useCallback((value) => {
      setApiKeysData((prevData) => ({ ...prevData, account_type: value }));
    }, []);

    const handleSubmitApiKeys = async (e) => {
      e.preventDefault();
      setLoading(true);
      const token = getAccessToken();

      try {
        const response = await fetch(
          "https://api.waterhub.africa/api/v1/client/device/keys/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(apiKeysData),
          }
        );

        const result = await response.json();
        if (response.ok) {
          toast({ description: "API Keys added successfully." });
        } else {
          toast({ variant: "destructive", description: result.message || "Failed to add API keys." });
        }
      } catch (error) {
        toast({ variant: "destructive", description: "An error occurred while adding API keys." });
      } finally {
        setLoading(false);
      }
    };

    const formattedDeviceData = useMemo(
      () => ({
        serialNumber: deviceData?.device_serial ?? "N/A",
        noOfTaps: deviceData?.no_of_tap ?? "N/A",
        valveType: deviceData?.valve_type ?? "N/A",
        clientName: deviceData?.user?.client ?? "N/A",
        clientEmail: deviceData?.user?.client_email ?? "N/A",
        siteName: deviceData?.site?.site_name ?? "N/A",
        siteCountry: deviceData?.site?.country ?? "N/A",
      }),
      [deviceData]
    );


 

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
          <TabsList className="flex flex-row gap-3 w-[500px] my-5 ">
            <TabsTrigger value="about">About</TabsTrigger>
            {/* <TabsTrigger value="tags">Tags</TabsTrigger> */}
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="tap-settings">Tap Settings</TabsTrigger>
            <TabsTrigger value="tap-callibration">Tap Callibration Settings</TabsTrigger>
          </TabsList>

          {/* About dialog */}
          <TabsContent value="about">
            <Card className="w-[400px] py-2">
                <CardContent>
                <p>Serial Number: {formattedDeviceData.serialNumber}</p>
                <p>No of Taps: {formattedDeviceData.noOfTaps}</p>
                <p>Valve Type: {formattedDeviceData.valveType}</p>
                <p>Client Name: {formattedDeviceData.clientName}</p>
                <p>Client Email: {formattedDeviceData.clientEmail}</p>
                <p>Site Name: {formattedDeviceData.siteName}</p>
                <p>Site Country: {formattedDeviceData.siteCountry}</p>

                </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tap settings */}
        <TabsContent value="tap-settings" >
            <Tapsettings deviceId={deviceId} valveType={deviceData?.valve_type} />
              
              
            </TabsContent >
       


          {/* Tap callibration */}
         <TabsContent value="tap-callibration" >
              <TapCallibration deviceId={deviceId} valveType={deviceData?.valve_type} /> 
              
            </TabsContent>
          


          <form onSubmit={handleSubmitApiKeys} className="  w-full md:max-w-2xl  mt-5 pl-2">
            <TabsContent value="api">
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="consumer_secret">Consumer Secret</Label>
                      <Input
                        id="consumer_secret"
                        type="text"
                        placeholder="Enter consumer secret"
                        value={apiKeysData.consumer_secret}
                        onChange={handleApiKeysInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="consumer_key">Consumer Key</Label>
                      <Input
                        id="consumer_key"
                        type="text"
                        placeholder="Enter consumer key"
                        value={apiKeysData.consumer_key}
                        onChange={handleApiKeysInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="short_code">Short Code</Label>
                      <Input
                        id="short_code"
                        type="text"
                        placeholder="Enter short code"
                        value={apiKeysData.short_code}
                        onChange={handleApiKeysInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pass_key">Pass Key</Label>
                      <Input
                        id="pass_key"
                        type="text"
                        placeholder="Enter pass key"
                        value={apiKeysData.pass_key}
                        onChange={handleApiKeysInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="account">Account Number</Label>
                      <Input
                        id="account"
                        type="text"
                        placeholder="Enter account number"
                        value={apiKeysData.account}
                        onChange={handleApiKeysInputChange}
                      />
                    </div>
                   
                    <div className="space-y-1">
                      <Label htmlFor="account_type">Account Type</Label>
                      <Select onValueChange={handleAccountTypeChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PAYBILL">PayBill</SelectItem>
                          <SelectItem value="TILL NUMBER">Till Number</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-blue-500 text-white">
                    Add Keys
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

