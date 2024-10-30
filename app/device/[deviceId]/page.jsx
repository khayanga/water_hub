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

const Page = ({params}) => {
   
  const { deviceId } = params;
  const [deviceData, setDeviceData] = useState(null);
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState('');
  const [tapSettings, setTapSettings] = useState({
    tap_unit_price_1: '',
    min_tap_unit_price_1: '',
    tap_unit_price_2: '',
    min_tap_unit_price_2: '',
  });
 
  const [tapCalibration, setTapCalibration] = useState({
    tap_unit_pulse_1: '',
    tap_unit_volume_1: '',
    tap_unit_pulse_2: '',
    tap_unit_volume_2: '',
  });

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

   const handleInputChange = (e) => {
    const { id, value } = e.target;
    setTapSettings((prevSettings) => ({
      ...prevSettings,
      [id]: value,
    }));
  };


 // Handle calibration input changes
  const handleCalibrationChange = (e) => {
    const { id, value } = e.target;
    setTapCalibration((prevCalibration) => ({
      ...prevCalibration,
      [id]: value,
    }));
  };


  const handleApiKeysInputChange = (e) => {
  const { id, value } = e.target;
  setApiKeysData((prevData) => ({
    ...prevData,
    [id]: value,
  }));
};


  const handleAccountTypeChange = (value) => {
    setApiKeysData((prevData) => ({
      ...prevData,
      account_type: value,
    }));
};


  const handleSubmitSettings = async (e) => {
    e.preventDefault();
    setError('');
    
    
    try {
      const response = await fetch(`https://api.waterhub.africa/api/v1/client/device/solenoid/tap-settings/${deviceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tapSettings),
      });

      const result = await response.json();
      if (response.ok) {
        
        alert("Tap settings updated successfully")
        console.log('Updated tap settings:', result);
      } else {
        setError('Failed to update tap settings');
        console.error('API Error:', result);
      }
    } catch (error) {
      setError('An error occurred while updating tap settings.');
      console.error('Error:', error);
    }
  };


  const handleSubmitCalibration = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`https://api.waterhub.africa/api/v1/client/device/solenoid/callibration/${deviceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tapCalibration),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Tap calibration updated successfully");
        console.log('Updated tap calibration:', result);
      } else {
        setError('Failed to update tap calibration');
      }
    } catch (error) {
      setError('An error occurred while updating tap calibration.');
    }
  };


  const handleSubmitApiKeys = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('https://api.waterhub.africa/api/v1/client/device/keys/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(apiKeysData),
    });

    const result = await response.json();
    if (response.ok) {
      alert('API Keys added successfully');
      console.log('API keys response:', result);
    } else {
      alert('Failed to add API keys');
      console.error('API error:', result);
    }
  } catch (error) {
    console.error('Error adding API keys:', error);
    alert('An error occurred while adding API keys.');
  }
  };


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
                <p>< span className="text-sm tracking-wide ">Serial Number:</span> {deviceData?.device_serial ?? 'N/A'}</p>
                <p>< span className="text-sm tracking-wide ">No of Taps:</span> {deviceData?.no_of_tap ?? 'N/A'}</p>
                <p>< span className="text-sm tracking-wide ">Valve Type :</span> {deviceData?.valve_type ?? 'N/A'}</p>
                <p>< span className="text-sm tracking-wide ">Client Name:</span> {deviceData?.user?.client ?? 'N/A'}</p>
                <p>< span className="text-sm tracking-wide ">Client Email:</span> {deviceData?.user?.client_email ?? 'N/A'}</p>
                <p>< span className="text-sm tracking-wide ">Site Name:</span> {deviceData?.site?.site_name ?? 'N/A'}</p>
                <p>< span className="text-sm tracking-wide ">Site Coutry:</span> {deviceData?.site?.country ?? 'N/A'}</p>
                </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tap settings */}

          <form onSubmit={handleSubmitSettings} className="w-full mt-5 pl-2">
            <TabsContent value="tap-settings">
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="tap_unit_price_1">Tap No 1 - Unit Price/Liter(KES)</Label>
                      <Input
                        id="tap_unit_price_1"
                        type="text"
                        placeholder="Enter unit price"
                        value={tapSettings.tap_unit_price_1}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="min_tap_unit_price_1">Tap No 1 - Min Dispense Price(KES)</Label>
                      <Input
                        id="min_tap_unit_price_1"
                        type="text"
                        placeholder="Enter min dispense price"
                        value={tapSettings.min_tap_unit_price_1}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="tap_unit_price_2">Tap No 2 - Unit Price/Liter(KES)</Label>
                      <Input
                        id="tap_unit_price_2"
                        type="text"
                        placeholder="Enter unit price"
                        value={tapSettings.tap_unit_price_2}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="min_tap_unit_price_2">Tap No 2 - Min Dispense Price(KES)</Label>
                      <Input
                        id="min_tap_unit_price_2"
                        type="text"
                        placeholder="Enter min dispense price"
                        value={tapSettings.min_tap_unit_price_2}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-blue-500 text-white">
                    Update Tap Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>

          {/* Tap callibration */}
         
           <form onSubmit={handleSubmitCalibration} className="w-full mt-5 pl-2">
            <TabsContent value="tap-callibration">
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="tap_unit_pulse_1">Tap No 1 - Unit Pulse/Liter</Label>
                      <Input
                        placeholder="Enter unit pulse"
                        id="tap_unit_pulse_1"
                        type="text"
                        value={tapCalibration.tap_unit_pulse_1}
                        onChange={handleCalibrationChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="tap_unit_volume_1">Tap No 1 - Unit Volume in Litres</Label>
                      <Input
                      placeholder='Enter unit volume'
                        id="tap_unit_volume_1"
                        type="text"
                        value={tapCalibration.tap_unit_volume_1}
                        onChange={handleCalibrationChange}
                      />
                    </div>
                  </div>
                  {/* Tap 2 Calibration */}
                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="tap_unit_pulse_2">Tap No 2 - Unit Pulse/Liter</Label>
                      <Input
                      placeholder="Enter unit pulse"
                        id="tap_unit_pulse_2"
                        type="text"
                        value={tapCalibration.tap_unit_pulse_2}
                        onChange={handleCalibrationChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="tap_unit_volume_2">Tap No 2 - Unit Volume in Litres</Label>
                      <Input
                      placeholder='Enter unit volume'
                        id="tap_unit_volume_2"
                        type="text"
                        value={tapCalibration.tap_unit_volume_2}
                        onChange={handleCalibrationChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-blue-500 text-white">Update Tap Calibration</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>

          {/* API Keys */}
           {/* <form  className="w-full mt-5 pl-2">
            <TabsContent value="api">
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="consumer_secret">Consumer secret</Label>
                      <Input
                        id="consumer_secret"
                        type="text"
                        placeholder="Enter consumer secret"
                        
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="consumer_key">Consumer Key</Label>
                      <Input
                        id="consumer_key"
                        type="text"
                        placeholder="Enter consumer key"
                        
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="short_code">Short Code</Label>
                      <Input
                        id="short_code"
                        type="text"
                        placeholder="Enter short code"
                        
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pass_key">Pass Key</Label>
                      <Input
                        id="pass_key"
                        type="text"
                        placeholder="Enter pass key "
                        
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="account">Account Number</Label>
                      <Input
                        id="account"
                        type="text"
                        placeholder="Enter account number"
                      />
                    </div>

                    <div className="space-y-1">
                  <Label htmlFor="status">Account TYpe</Label>

                  <Select onValueChange={(value) => setAccountType(value)} 
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PayBill">PayBill</SelectItem>
                      <SelectItem value="Till Number">Till Number</SelectItem>
                      
                    </SelectContent>
                  </Select>
                    </div>
                  </div>
                  
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-blue-500 text-white">Add Keys</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form> */}


          <form onSubmit={handleSubmitApiKeys} className="w-full mt-5 pl-2">
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

export default Page;