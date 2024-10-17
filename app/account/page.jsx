"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Useravatar from "@/components/Useravatar";
import { getAccessToken } from "@/components/utils/auth";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bankName: "",
    mpesaNumber: "",
    bankAccount: "",
    password: "",
    confirmPassword: "",
    approverName: "",
    approverEmail: "",
    approverContact: "",
    image: null,
  });
  const token = getAccessToken();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    
    const url = "https://api.waterhub.africa/api/v1/client/profile/password";

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    const body = JSON.stringify({
      old_password: formData.password,
      password: formData.confirmPassword,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Password updated successfully!");
        console.log("Password Update Response:", result);
      } else {
        alert(result.message || "Failed to update password");
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("An error occurred while updating the password.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Sidebar />

      <div className="p-4 flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Useravatar />

        <main className=" px-4 py-2 sm:px-6 sm:py-0 ">
        <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Profile details</h1>
          </div>

          <p className="mt-2 tracking-wider text-sm font-light  ">
          Fill in the form below to make changes to your account.
        </p>

        <form className="w-full mt-5 " onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter client's name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(+254...)"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    type="text"
                    placeholder="Enter bank name"
                    value={formData.bankName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mpesaNumber">Mpesa Number</Label>
                  <Input
                    id="mpesaNumber"
                    type="text"
                    placeholder="Enter mpesa number"
                    value={formData.mpesaNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bankAccount">Bank Account Number</Label>
                  <Input
                    id="bankAccount"
                    type="text"
                    placeholder="Enter account number"
                    value={formData.bankAccount}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="approverName">Approver Name</Label>
                  <Input
                    id="approverName"
                    type="text"
                    placeholder="Enter approver name"
                    value={formData.approverName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="approverEmail">Approver Email</Label>
                  <Input
                    id="approverEmail"
                    type="email"
                    placeholder="Enter approver email"
                    value={formData.approverEmail}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="approverContact">Approver Contact</Label>
                  <Input
                    id="approverContact"
                    type="tel"
                    placeholder="(+254...)"
                    value={formData.approverContact}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="image">Profile Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        image: e.target.files[0],
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-blue-500 text-white">
                Update profile
              </Button>
            </CardFooter>
          </Card>
        </form>

        </main>
        
        
      </div>
    </div>
  );
};

export default Page;
