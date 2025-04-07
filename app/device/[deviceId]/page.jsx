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
import { useToast } from "@/hooks/use-toast";
import About from "@/components/device-management/About";
import SolenoidSettings from "@/components/device-management/SolenoidSettings";
import SolenoidCallibration from "@/components/device-management/SolenoidCallibration";
import ApiKeys from "@/components/device-management/ApiKeys";
import MbvSettings from "@/components/device-management/MbvSettings";


export default  function Page() {

  const {toast} = useToast();
  const { deviceId } = useParams();
  const token = getAccessToken();
  const [loading, setLoading] = useState(false);
  const [numTaps, setNumTaps] = useState(0);
  const [valveType, setValveType] = useState("");
  const [deviceData, setDeviceData] = useState(null);
  const [error, setError] = useState('');
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
  }, [deviceId, token, toast]);


  // Fetching mbv data
  

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
             <About deviceData={deviceData} />
          </TabsContent>
          
          {/* Tap settings */}

          {valveType === "solenoid" && (
            <>
              <TabsContent value="tap-settings">
                <SolenoidSettings
                  deviceId={deviceId} 
                  token={token} 
                  numTaps={numTaps} 
                  toast={toast}
                />
              </TabsContent>
              
              <TabsContent value="tap-callibration">
                <SolenoidCallibration
                  deviceId={deviceId} 
                  token={token} 
                  numTaps={numTaps} 
                  toast={toast}
                />
              </TabsContent>
            </>
          )}

          {/* mbv */}
          {valveType !== "solenoid" && (
            <TabsContent value="settings-pricing">
              <MbvSettings
                deviceId={deviceId} 
                token={token} 
                numTaps={numTaps} 
                toast={toast}
              />
            </TabsContent>
          )}

          

          <TabsContent value="api">
            <ApiKeys 
              deviceId={deviceId} 
              token={token} 
              loading={loading} 
              setLoading={setLoading} 
              toast={toast}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

