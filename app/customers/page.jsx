"use client";

import React, { useState, useEffect } from "react";
import { ArrowDownUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";

import Useravatar from "@/components/Useravatar";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [customers, setCustomers] = useState(() => {
    const storedCustomers = localStorage.getItem("customers");
    return storedCustomers ? JSON.parse(storedCustomers) : [];
  });
  

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const newCustomer = {
      name: formData.name,
      status: "Active",
      contact: formData.phone,
      date: new Date().toLocaleDateString(),
    };

    setCustomers((prevCustomers) => {
      const updatedCustomers = [...prevCustomers, newCustomer];
      return updatedCustomers;
    });

    // Store updated customers in local storage
    localStorage.setItem("customers", JSON.stringify(customers));

    console.log("Form data:", {
      ...formData,
      image: formData.image ? formData.image.name : null,
    });

    // Reset the form data to its initial state
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      image: null,
    });
    setFormError("");
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedCustomers = [...customers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setCustomers(sortedCustomers);
  };

  return (
    <div className="w-11/12 mx-auto">
      <Sidebar />

      <div className="p-4 w-full mx-auto">
        <div className="flex flex-row justify-between p-2 w-full">
          <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Customers Management</h1>
            <Button className="bg-blue-500 px-6 py-1 text-white">
              {customers.length}
            </Button>
          </div>
          <div>
            <Useravatar/>
          </div>
        </div>

        <p className="mt-2 tracking-wider text-sm font-light pl-2">
          Fill in the form below to register a customer.
        </p>

        <form className="w-full mt-5 pl-2" onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              {formError && (
                <div className="text-red-500 mb-2">{formError}</div>
              )}
              <div className="flex flex-wrap gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Client Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter client's name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Client Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Client Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(+254...)"
                    value={formData.phone}
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
                  <Label htmlFor="image">Upload Image (optional)</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-blue-500 text-white">
                Add customer
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="flex flex-row items-center justify-between gap-6 pl-4 mt-8">
          <h1 className="font-bold tracking-wider">Customers Lists</h1>
        </div>

        <Card className="ml-4">
          <Table>
            <TableCaption>A list of all the customers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => sortData("name")}>
                  <div className="flex items-center">
                    Customer name
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "name" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead onClick={() => sortData("status")}>
                  <div className="flex items-center">
                    Status
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "status" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead onClick={() => sortData("contact")}>
                  <div className="flex items-center">
                    Contact
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "contact" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead onClick={() => sortData("date")}>
                  <div className="flex items-center">
                    Date
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "date" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.status}</TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>{customer.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Page;
