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
  const token = getAccessToken();
  const [tapSettings, setTapSettings] = useState({});
  const [numTaps, setNumTaps] = useState(0);
  const [valveType, setValveType] = useState("");
  const [tapCalibration, setTapCalibration] = useState({});
  const [mbvData, setMbvData] = useState({})
  const [solenoidData, setSolenoidData] = useState({})
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
          const tapCount = parseInt(data.device.no_of_tap, 10) || 1;
        setNumTaps(tapCount);

        setValveType(data.device.valve_type); // Store valve type

        // Initialize tap settings dynamically
        const initialSettings = {};
        for (let i = 1; i <= tapCount; i++) {
          initialSettings[`tap_unit_price_${i}`] = "";
          initialSettings[`min_tap_unit_price_${i}`] = "";
        }
        setTapSettings(initialSettings);

        const initialCalibration = {};
        for (let i = 1; i <= tapCount; i++) {
          initialCalibration[`tap_unit_pulse_${i}`] = "";
          initialCalibration[`tap_unit_volume_${i}`] = "";
        }
        setTapCalibration(initialCalibration);
         
        } else {
          setError("Failed to fetch device details");
        }
      } catch (error) {
        setError("An error occurred while fetching device details.");
      }
    };

    fetchDevice();
  }, [deviceId]);


  // Fetching mbv data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.waterhub.africa/api/v1/client/device/mbv/settings/${deviceId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        console.log(data)
        if (data.status === "Success") {
          // Convert API response to key-value format
          const settings = data.data.reduce((acc, item) => {
            acc[item.option_key] = item.option_value;
            return acc;
          }, {});

          setMbvData(settings);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  // Fetching solenoid

  useEffect(() => {
    if (!deviceId || !token) {
      console.error("Missing deviceId or token");
      return;
    }
  
    const fetchSolenoidSettings = async () => {
      try {
        const response = await fetch(`https://api.waterhub.africa/api/v1/client/device/solenoid/settings/${deviceId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data.status === "Success") {
          const settings = data.data.settings;
          setNumTaps(settings.length);
  
          const settingsMap = {};
          const calibrationMap = {};
  
          settings.forEach((tap) => {
            const tapNumber = tap.tap;
            settingsMap[`tap_unit_price_${tapNumber}`] = tap.price;
            settingsMap[`min_tap_unit_price_${tapNumber}`] = tap.min_dispense_amount;
            calibrationMap[`tap_unit_pulse_${tapNumber}`] = tap.unit_pulse;
            calibrationMap[`tap_unit_volume_${tapNumber}`] = tap.unit_volume;
          });
  
          setTapSettings(settingsMap);
          setTapCalibration(calibrationMap);
        }
      } catch (error) {
        console.error("Error fetching tap settings:", error);
      }
    };
  
    fetchSolenoidSettings();
  }, [deviceId, token]);
  

  const handleMbvChange = (e, tapNumber, key) => {
    setMbvData((prev) => ({
      ...prev,
      [`tap_unit_${key}_${tapNumber}`]: e.target.value,
    }));
  };

  const handleTapStateChange = (value, tapNumber) => {
    setMbvData((prev) => ({
      ...prev,
      [`tap_state_${tapNumber}`]: value,
    }));
  };

  const handleMbvSubmit = async (e) => {
    e.preventDefault();

    // Format data for API
    const payload = {};
    for (let i = 1; i <= numTaps; i++) {
      payload[`tap_unit_price_${i}`] = formData[`tap_unit_price_${i}`] || "";
      payload[`tap_unit_volume_${i}`] = formData[`tap_unit_volume_${i}`] || "";
      payload[`tap_unit_pulse_${i}`] = formData[`tap_unit_pulse_${i}`] || "";
    }

    try {
      const response = await fetch(`https://api.waterhub.africa/api/v1/client/device/mbv/settings/${deviceId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Tap settings updated successfully!");
      } else {
        alert("Error updating tap settings: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };


  const handleInputChange = (e) => {
    setTapSettings({ ...tapSettings, [e.target.id]: e.target.value });
  };

  const handleCalibrationChange = (e) => {
    setTapCalibration({ ...tapCalibration, [e.target.id]: e.target.value });
  };


  const handleSubmitTapSettings = async (e) => {
    e.preventDefault();
  
    if (!deviceId) {
      toast({ title: "Error", description: "Device ID is missing." });
      return;
    }
  
    const endpoint = `https://api.waterhub.africa/api/v1/client/device/solenoid/tap-settings/${deviceId}`;
  
    const payload = {};
    for (let i = 1; i <= numTaps; i++) {
      payload[`tap_unit_price_${i}`] = Number(tapSettings[`tap_unit_price_${i}`]) || 0;
      payload[`min_tap_unit_price_${i}`] = Number(tapSettings[`min_tap_unit_price_${i}`]) || 0;
    }
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast({ title: "Success", description: "Tap settings updated successfully!" });
      } else {
        toast({ title: "Error", description: result?.message || "Failed to update tap settings." });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred while updating tap settings." });
    }
  };
  
  const handleSubmitCalibration = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!deviceId) {
      toast({ title: "Error", description: "Device ID is missing." });
      return;
    }
  
    const endpoint = `https://api.waterhub.africa/api/v1/client/device/solenoid/callibration/${deviceId}`;
  
    const payload = {};
    for (let i = 1; i <= numTaps; i++) {
      payload[`tap_unit_pulse_${i}`] = Number(tapCalibration[`tap_unit_pulse_${i}`]) || 0;
      payload[`min_tap_unit_volume_${i}`] = Number(tapCalibration[`min_tap_unit_volume_${i}`]) || 0;
    }
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast({ title: "Success", description: "Tap calibration updated successfully!" });
      } else {
        toast({ title: "Error", description: result?.message || "Failed to update tap calibration." });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred while updating tap calibration." });
    }
  };
  

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetch("https://api.waterhub.africa/api/v1/client/device/keys/list", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result.status === "Success" && result.data.length > 0) {
          const keys = result.data[0]; 
          setApiKeysData({
            consumer_secret: keys.MPESA_CONSUMER_SECRET || "",
            consumer_key: keys.MPESA_CONSUMER_KEY || "",
            short_code: keys.MPESA_STK_SHORTCODE || "",
            pass_key: keys.MPESA_PASSKEY || "",
            account: keys.MPESA_ACCOUNT || "",
            account_type: keys.ACCOUNT_TYPE || "",
          });
        } else {
          console.error("Failed to fetch API keys:", result);
        }
      } catch (error) {
        console.error("Error fetching API keys:", error);
      }
    };

    fetchApiKeys();
  }, []);

  const handleApiKeysInputChange = (e) => {
    setApiKeysData({ ...apiKeysData, [e.target.id]: e.target.value });
  };

  const handleAccountTypeChange = (value) => {
    setApiKeysData({ ...apiKeysData, account_type: value });
  };


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
          <TabsList className="flex flex-row gap-3 max-w-2xl my-5 justify-start ">
            <TabsTrigger value="about">About</TabsTrigger>
            
            <TabsTrigger value="api">API Keys</TabsTrigger>
            {valveType === "solenoid" ? (
              <>
                <TabsTrigger value="tap-settings">Tap Settings</TabsTrigger>
                <TabsTrigger value="tap-callibration">Tap Calibration Settings</TabsTrigger>
              </>
            ) : (
              <TabsTrigger value="settings-pricing">Settings & Pricing</TabsTrigger>
            )}
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
        
          <form onSubmit={handleSubmitTapSettings} className="w-full md:max-w-2xl mt-5 pl-2">
            <TabsContent value="tap-settings">
              <Card>
                <CardContent className="space-y-2">
                  {Array.from({ length: numTaps }).map((_, index) => {
                    const tapNumber = index + 1;
                    return (
                      <div key={tapNumber} className="flex flex-wrap gap-8 p-2">
                        <div className="space-y-1">
                          <Label htmlFor={`tap_unit_price_${tapNumber}`}>Tap {tapNumber} - Unit Price/Liter (KES)</Label>
                          <Input
                            id={`tap_unit_price_${tapNumber}`}
                            type="number"
                            placeholder="Enter unit price"
                            value={tapSettings[`tap_unit_price_${tapNumber}`] || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`min_tap_unit_price_${tapNumber}`}>Tap {tapNumber} - Min Dispense Price (KES)</Label>
                          <Input
                            id={`min_tap_unit_price_${tapNumber}`}
                            type="number"
                            placeholder="Enter min dispense price"
                            value={tapSettings[`min_tap_unit_price_${tapNumber}`] || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    );
                  })}
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
         
          <form onSubmit={handleSubmitCalibration} className="w-full md:max-w-2xl mt-5 pl-2">
            <TabsContent value="tap-callibration">
              <Card>
                <CardContent className="space-y-2">
                  {Array.from({ length: numTaps }).map((_, index) => {
                    const tapNumber = index + 1;
                    return (
                      <div key={tapNumber} className="flex flex-wrap gap-8 p-2">
                        <div className="space-y-1">
                          <Label htmlFor={`tap_unit_pulse_${tapNumber}`}>Tap No {tapNumber} - Unit Pulse/Liter</Label>
                          <Input
                            placeholder="Enter unit pulse"
                            id={`tap_unit_pulse_${tapNumber}`}
                            type="number"
                            value={tapCalibration[`tap_unit_pulse_${tapNumber}`] || ""}
                            onChange={handleCalibrationChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`tap_unit_volume_${tapNumber}`}>Tap No {tapNumber} - Unit Volume in Litres</Label>
                          <Input
                            placeholder="Enter unit volume"
                            id={`tap_unit_volume_${tapNumber}`}
                            type="number"
                            value={tapCalibration[`tap_unit_volume_${tapNumber}`] || ""}
                            onChange={handleCalibrationChange}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-blue-500 text-white">
                    Update Tap Calibration
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>

          {/* mbv */}

          <form onSubmit={handleMbvSubmit} className="w-full md:max-w-2xl mt-5 pl-2">
            <TabsContent value="settings-pricing">
              <Card>
                <CardContent className="space-y-6 pt-4">
                  {Array.from({ length: numTaps }).map((_, index) => {
                    const tapNumber = index + 1;

                    return (
                      <div key={tapNumber} className="flex flex-col gap-3">
                        <div className="flex flex-row items-center justify-between">
                        <h3 className="text-gray-500 text-md">Tap No {tapNumber}</h3>
                        <div className="space-y-1">
                        <Label htmlFor={`tap_state_${tapNumber}`}>Tap state</Label>
                          <Select onValueChange={(value) => handleTapStateChange(value, tapNumber)}>
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder={mbvData[`tap_state_${tapNumber}`] || "Select state"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="On">On</SelectItem>
                              <SelectItem value="Off">Off</SelectItem>
                            </SelectContent>
                          </Select>
                    </div>


                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`unit_price_${tapNumber}`}>Unit Price * (KES)</Label>
                          <Input
                            placeholder="Enter unit price"
                            id={`unit_price_${tapNumber}`}
                            type="number"
                            value={mbvData[`tap_unit_price_${tapNumber}`] || ""}
                            onChange={(e) => handleMbvChange(e, tapNumber, "price")}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`unit_volume_${tapNumber}`}>Unit Volume * (Litres)</Label>
                          <Input
                            placeholder="Enter unit volume"
                            id={`unit_volume_${tapNumber}`}
                            type="number"
                            value={mbvData[`tap_unit_volume_${tapNumber}`] || ""}
                            onChange={(e) => handleMbvChange(e, tapNumber, "volume")}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`unit_pulses_${tapNumber}`}>Unit Pulses * (Flow sensors)</Label>
                          <Input
                            placeholder="Enter unit pulses"
                            id={`unit_pulses_${tapNumber}`}
                            type="number"
                            value={mbvData[`tap_unit_pulse_${tapNumber}`] || ""}
                            onChange={(e) => handleMbvChange(e, tapNumber, "pulse")}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-blue-500 text-white">
                    Update Tap Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>




          <form onSubmit={handleSubmitApiKeys} className="w-full md:max-w-2xl mt-5 pl-2">
            <TabsContent value="api">
              <Card>
                <CardContent className="space-y-6">
                  <div className="flex flex-col  gap-8 p-2">
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
                      <Select onValueChange={handleAccountTypeChange} value={apiKeysData.account_type}>
                        <SelectTrigger >
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

