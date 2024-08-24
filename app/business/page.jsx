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

const Page = () => {
    const initialFormData = {
        name: "",
        email: "",
        phone: "",
        facebook: "",
        instagram: "",
        twitter: "",
        address: "",
        logo: null,
        banner: null,
        favicon: null,
      };
    
      const [formData, setFormData] = useState(initialFormData);
    
      const handleInputChange = (e) => {
        const { id, value, files } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [id]: files ? files[0] : value,
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        alert("Business details saved successfully");
        setFormData(initialFormData); 
      };

  return (
    <div className="w-11/12 mx-auto">
      <Sidebar />

      <div className="p-4 w-full mx-auto">
        <div className="flex flex-row justify-between p-2 w-full">
          <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Business Settings</h1>
          </div>
          <div>
            <Useravatar />
          </div>
        </div>

        <p className="mt-2 tracking-wider text-sm font-light pl-2">
          Fill in the form below to register business details.
        </p>

        <form className="w-full mt-5 pl-2" onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter business name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Business Contact</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(+254...)"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="https://facebook.com"
                    value={formData.facebook}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://insta.com"
                    value={formData.instagram}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://twitter.com"
                    value={formData.twitter}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="(Location...)"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="logo">Business Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="banner">Business Banner</Label>
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="favicon">App Favicon</Label>
                  <Input
                    id="favicon"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
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
        </form>
      </div>
    </div>
  );
};

export default Page;
