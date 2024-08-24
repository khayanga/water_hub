"use client";
import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Useravatar from "@/components/Useravatar";

const Page = () => {
  const [smsSettings, setSmsSettings] = useState({
    senderId: "",
    apiKey: "",
    email: "",
    smsUrl: ""
  });

  const [paymentSettings, setPaymentSettings] = useState({
    publicKey: "",
    secretKey: ""
  });

  const handleSmsChange = (e) => {
    const { id, value } = e.target;
    setSmsSettings((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { id, value } = e.target;
    setPaymentSettings((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSmsSubmit = (e) => {
    e.preventDefault();
    console.log("SMS Settings:", smsSettings);
    setSmsSettings({
      senderId: "",
      apiKey: "",
      email: "",
      smsUrl: ""
    });
    alert("SMS Settings saved successfully");
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    console.log("Payment Gateway Settings:", paymentSettings);
    setPaymentSettings({
      publicKey: "",
      secretKey: ""
    });
    alert("Payment Gateway Settings saved successfully");
  };

  return (
    <div className="w-11/12 mx-auto">
      <Sidebar />

      <div className="p-4 w-full mx-auto">
        <div className="flex flex-row justify-between p-2 w-full">
          <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">System Settings</h1>
          </div>
          <div>
            <Useravatar />
          </div>
        </div>

        <p className="mt-1 tracking-wider text-sm font-light pl-2">
          Fill in the form below to change the system settings
        </p>

        <Tabs defaultValue="sms" className="w-full">
          <TabsList className="flex flex-row gap-3 w-[480px] my-5">
            <TabsTrigger value="sms">SMS Settings</TabsTrigger>
            <TabsTrigger value="payment">Payment Gateway Settings</TabsTrigger>
            <TabsTrigger value="mail">Mail Settings</TabsTrigger>
          </TabsList>

          {/* SMS FORM */}
          <form className="w-full mt-5 pl-2" onSubmit={handleSmsSubmit}>
            <TabsContent value="sms">
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="senderId">SMS Sender ID</Label>
                      <Input
                        id="senderId"
                        type="text"
                        placeholder="Enter sender id"
                        value={smsSettings.senderId}
                        onChange={handleSmsChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="apiKey">SMS API Key</Label>
                      <Input
                        id="apiKey"
                        type="text"
                        placeholder="Enter API key"
                        value={smsSettings.apiKey}
                        onChange={handleSmsChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">SMS Email Account</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="sms@gmail.com"
                        value={smsSettings.email}
                        onChange={handleSmsChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="smsUrl">SMS URL</Label>
                      <Input
                        id="smsUrl"
                        type="url"
                        placeholder="https://sms.com"
                        value={smsSettings.smsUrl}
                        onChange={handleSmsChange}
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

          {/* Payment gateway */}
          <form className="w-full mt-5 pl-2" onSubmit={handlePaymentSubmit}>
            <TabsContent value="payment">
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="publicKey">Public Key</Label>
                      <Input
                        id="publicKey"
                        type="text"
                        placeholder="Enter public key"
                        value={paymentSettings.publicKey}
                        onChange={handlePaymentChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="secretKey">Secret Key</Label>
                      <Input
                        id="secretKey"
                        type="text"
                        placeholder="Enter secret key"
                        value={paymentSettings.secretKey}
                        onChange={handlePaymentChange}
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

