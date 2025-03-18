"use client";
import React, { useEffect, useState } from "react";
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

  const token = getAccessToken();
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    
  });

  const [billingFormData, setBillingFormData] = useState({
    bankName: "",
    mpesaNumber: "",
    bankAccount: "",
    approverName: "",
    approverEmail: "",
    approverContact: "",
  });

  

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("https://api.waterhub.africa/api/v1/client/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result.status === "Successful") {
          // Populate the form data with the fetched user details
          const userData = result.data;

          console.log(result.data)
          setProfileFormData((prevData) => ({
            ...prevData,
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
          }));
        } else {
          console.error("Failed to fetch user details:", result.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [token]);


  useEffect(() => {
    if (!token) {
      console.error("Authorization token is missing");
      return;
    }

    const fetchBillingDetails = async () => {
      try {
        const response = await fetch("https://api.waterhub.africa/api/v1/client/billing", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result.status === "Successful") {
          const billingData = result.data;
          console.log(result.data)
          setBillingFormData((prevData) => ({
            ...prevData,
            bankName: billingData.bank_name || "",
            bankAccount: billingData.account_number || "",
            mpesaNumber: billingData.bank_paybill || "",
            approverName: billingData.approver_name || "",
            approverEmail: billingData.approver_email || "",
            approverContact: billingData.approver_phone || "",
          }));
        } else {
          console.error("Failed to fetch billing details:", result.message);
        }
      } catch (error) {
        console.error("Error fetching billing details:", error);
      }
    };

    fetchBillingDetails();
  }, [token]);

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleBillingChange = (e) => {
    const { id, value } = e.target;
    setBillingFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (profileFormData.password !== profileFormData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const url = "https://api.waterhub.africa/api/v1/client/profile/password";

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const body = JSON.stringify({
      old_password: profileFormData.password,
      password: profileFormData.confirmPassword,
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

  const handleBillingSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent in the POST request
    const billingData = {
      approver_name: billingFormData.approverName,
      approver_email: billingFormData.approverEmail,
      approver_phone: billingFormData.approverContact,
      bank_name: billingFormData.bankName,
      account_number: billingFormData.bankAccount,
      bank_paybill: billingFormData.mpesaNumber,
    };

    const url = "https://api.waterhub.africa/api/v1/client/billing";
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const body = JSON.stringify(billingData);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      const result = await response.json();

      if (response.ok && result.status === "Successful") {
        alert("Billing details updated successfully!");
        console.log("Billing Update Response:", result);
      } else {
        alert(result.message || "Failed to update billing details");
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("An error occurred while updating billing details.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Sidebar />

      <div className="p-4 flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Useravatar />

        <main className="px-4 py-2 sm:px-6 sm:py-0">
          <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Profile details</h1>
          </div>

          <p className="mt-2 tracking-wider text-sm font-light">
            Fill in the form below to make changes to your account.
          </p>

          <form className="w-full md:max-w-4xl mt-5" onSubmit={handleProfileSubmit}>
            <Card>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-8 p-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter client's name"
                      value={profileFormData.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@gmail.com"
                      value={profileFormData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(+254...)"
                      value={profileFormData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      value={profileFormData.password}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={profileFormData.confirmPassword}
                      onChange={handleProfileChange}
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

          <div className="flex flex-row items-center gap-6 mt-8">
            <h1 className="font-bold tracking-wider">Billing details</h1>
          </div>

          <p className="mt-2 tracking-wider text-sm font-light">
            Fill in the form below to make changes to your account.
          </p>

          <form className="w-full md:max-w-4xl mt-5" onSubmit={handleBillingSubmit}>
            <Card>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-8 p-2">
                  <div className="space-y-1">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      type="text"
                      placeholder="Enter bank name"
                      value={billingFormData.bankName}
                      onChange={handleBillingChange}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mpesaNumber">Mpesa Number</Label>
                    <Input
                      id="mpesaNumber"
                      type="text"
                      placeholder="Enter Mpesa number"
                      value={billingFormData.mpesaNumber}
                      onChange={handleBillingChange}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bankAccount">Bank Account Number</Label>
                    <Input
                      id="bankAccount"
                      type="text"
                      placeholder="Enter account number"
                      value={billingFormData.bankAccount}
                      onChange={handleBillingChange}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="approverName">Approver Name</Label>
                    <Input
                      id="approverName"
                      type="text"
                      placeholder="Enter approver name"
                      value={billingFormData.approverName}
                      onChange={handleBillingChange}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="approverEmail">Approver Email</Label>
                    <Input
                      id="approverEmail"
                      type="email"
                      placeholder="Enter approver email"
                      value={billingFormData.approverEmail}
                      onChange={handleBillingChange}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="approverContact">Approver Contact</Label>
                    <Input
                      id="approverContact"
                      type="tel"
                      placeholder="(+254...)"
                      value={billingFormData.approverContact}
                      onChange={handleBillingChange}
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bg-blue-500 text-white">
                  Update Billing Details
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
